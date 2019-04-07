## Inspiration

We love dogs! Who doesn't? We wanted to apply blockchain technology in a meaningful way, and we came up with the idea of helping dogs and people to know more about the pets they decide to adopt or buy.

Blockchain is ideal for this use case, since all of the information is verifiable by anyone from the public blockchain records, which are immutable by anybody. Only verified professionals can add information about a dog. The technology also allows to track lost dogs and find their owner once they are found.

## What it does

It is a web App that allows anybody to read a dog's ledger information, as a series of timestamped events stored in the blockchain. These events include for example vaccines, birth, lost, found, illnesses, previous homes, etc. With this information someone looking for a dog at a shelter will have so much more information to make their decision,and the app will help them find their perfect friend to take home. The information can also help vets with diagnosing illnesses by providing the whole medical record in an easy way.

In the event that the dog gets lost, then when it is found, the chip can be scanned and used to trace back the contact information for the owner by anyone with internet access.

New information and events can only be sent by verified professionals who have provided their documentation via Blockstack and have had their profile verified as a professional.

## How we built it

The app is separated between frontend and backend. The backend was developed by Guillem and Sergi, and the frontend was developed by Marc.

The backend is developed in javascript and react. We use Blockstack to authenticate users. We use a blockstack token to access the backend to make requests to the blockchain where the dogs' information is stored. The communication with the backend is via an http API.

the backend is developed in typescript. The blockchain used for storing dog information is the NEM blockchain, and we use mongodb to store all the verified professionals and all the user's dogs to quickly find them. The backend is deployed on google cloud as a Docker image container on a kubernetes container.

## Challenges we ran into

We had to learn how to deploy the backend in google cloud with kubernetes, we had to figure out how to expose the API port to the internet so that it is accessible by the frontend. We also had to learn how to use Blockstack.

## Accomplishments that we're proud of

We were able to use blockchain successfully in a meaningful way for a cause we believe in.

## What we learned

Sergi was already familiar with blockchain before the hackathon but the other two members learnt about the technology and how it works.

We learned about google cloud, docker and kubernetes deployments.

## What's next for PetChain

A method for verifying professionals from their documentation should be added to the app, since now you could only be verified manually by us and added to the database. If we want to make the system more decentralized we could design a reputation system so that we are not the only centralized organization that decides who can post data and who can not.

It would also be interesting to try this with an actual dog to see if we can actually use the chip id for our application. We know we don't have access to the data stored on it, but we only need a unique id for our app to work.
