import {Address, PublicAccount, AccountHttp, ChainHttp, BlockHttp, TransactionHttp, ServerConfig, NEMLibrary, NetworkTypes, Transaction, TransactionTypes, TransferTransaction, MultisigTransaction, PlainMessage, SignedTransaction, NodeHttp, TimeWindow} from "nem-library";
import * as CryptoJS from "crypto-js";
import { Observable } from "rxjs";

NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

const nodes = [
  {protocol: "http", domain: "104.128.226.60", port: 7890},
] as ServerConfig[];
const accountHttp = new AccountHttp(nodes);
const chainHttp = new ChainHttp(nodes);
const blockHttp = new BlockHttp(nodes);
const transactionHttp = new TransactionHttp(nodes);
const nodeHttp = new NodeHttp(nodes);

export const getDogAddress = (chipNumber: string): Address => {
  const pk = CryptoJS.SHA3(chipNumber, { outputLength: 256 }).toString();
  const pa = PublicAccount.createWithPublicKey(pk);
  return pa.address;
};

const getAllTransactions = (receiver: Address): Observable<Transaction[]> => {
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

export const broadcastTransaction = async (trans: SignedTransaction): Promise<void> => {
  await transactionHttp.announceTransaction(trans).first().toPromise();
}

export const createTimeWindow = async (): Promise<TimeWindow> => {
  // for fixing the timestamp error at testnet
  const nodeInfo = await nodeHttp.getNisNodeInfo().first().toPromise();
  const chainTime = nodeInfo.nisInfo.currentTime;
  const d = new Date();
  const timeStamp = Math.floor(chainTime) + Math.floor(d.getSeconds() / 10);
  const due = (NEMLibrary.getNetworkType() === NetworkTypes.TEST_NET) ? 60 : 24 * 60;
  const deadline = timeStamp + due * 60;
  return (TimeWindow as any).createFromDTOInfo(timeStamp, deadline) as TimeWindow;
}

