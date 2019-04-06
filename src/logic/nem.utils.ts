import {Address, PublicAccount, AccountHttp, ChainHttp, BlockHttp, TransactionHttp, ServerConfig, NEMLibrary, NetworkTypes, Transaction, TransactionTypes, TransferTransaction, MultisigTransaction, PlainMessage} from "nem-library";
import * as CryptoJS from "crypto-js";
import { Observable } from "rxjs";

export const getDogAddress = (chipNumber: string): Address => {
  const pk = CryptoJS.SHA3(chipNumber, { outputLength: 256 }).toString();
  const pa = PublicAccount.createWithPublicKey(pk);
  return pa.address;
};

let accountHttp: AccountHttp;
let chainHttp: ChainHttp;
let blockHttp: BlockHttp;
let transactionHttp: TransactionHttp;

const initializeHttp = () => {
    let nodes: ServerConfig[] = [];

    if (NEMLibrary.getNetworkType() === NetworkTypes.TEST_NET) {
        nodes = [
            {protocol: "http", domain: "104.128.226.60", port: 7890},
        ];
    } else if (NEMLibrary.getNetworkType() === NetworkTypes.MAIN_NET) {
        nodes = [
            {protocol: "http", domain: "88.99.192.82", port: 7890},
        ];
    } else {
        throw new Error("Not bootstrapped");
    }

    accountHttp = new AccountHttp(nodes);
    if (NEMLibrary.getNetworkType() === NetworkTypes.TEST_NET) {
        (accountHttp as any).historicalNodes = [
            {protocol: "http", domain: "95.216.73.245", port: 7890},
        ];
    }
    chainHttp = new ChainHttp(nodes);
    blockHttp = new BlockHttp(nodes);
    transactionHttp = new TransactionHttp(nodes);
};

const getAllTransactions = (receiver: Address): Observable<Transaction[]> => {
  initializeHttp();
  const pageable = accountHttp.incomingTransactionsPaginated(receiver, {pageSize: 100});
  return pageable
      .map((allTransactions) => {
          pageable.nextPage();
          return allTransactions.filter((t) => (t.type === TransactionTypes.MULTISIG || t.type === TransactionTypes.TRANSFER));
      }).reduce((acc, page) => {
          return acc.concat(page);
      }, []);
};

const getTransactionsWithString =
(queryString: string, receiver: Address, sender?: Address, position: number = 0): Observable<TransferTransaction[]> => {
    initializeHttp();
    return getAllTransactions(receiver)
        .map((allTransactions) => {
            // We only want transfer and multisig transactions, and we are only interested in
            // the inner transaction for multisig transactions
            let transactions: TransferTransaction[] = allTransactions
                .filter((t) => (t.type === TransactionTypes.MULTISIG || t.type === TransactionTypes.TRANSFER))
                .map((transaction) => {
                    if (transaction.type === TransactionTypes.MULTISIG) {
                        transaction = (transaction as MultisigTransaction).otherTransaction;
                    }
                    return (transaction as TransferTransaction);
                });
            // filter by sender
            if (sender !== undefined) {
                transactions = transactions.filter((t) => (t.signer !== undefined && t.signer.address.plain() === sender.plain()));
            }
            // Then we get the messages, we only want the plain messages, not encrypted
            return transactions
                .filter((t) => t.message.isPlain())
                .filter((t) => (t.message as PlainMessage).plain().includes(queryString, position));
        });
};

export const getAllMessagesWithString =
(queryString: string, receiver: Address, sender?: Address, block?: number): Promise<string[] | null> => {
    return getTransactionsWithString(queryString, receiver, sender = sender)
        .map((transactions) => {
            if (transactions.length === 0) {
                return null;
            }
            // filter only transactions sent before block
            if (block !== undefined) {
                const validTransactions = transactions.filter((t) => t.getTransactionInfo().height < block);
                return validTransactions.map((transaction) => (transaction.message as PlainMessage).plain());
            } else {
                return transactions.map((transaction) => (transaction.message as PlainMessage).plain());
            }
        }).first().toPromise();
};
