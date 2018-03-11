# Amazon micro-service architecture

Scalable micro-service architecture representing simplified 
product search and order data flows.

## Roadmap

View the project roadmap [here](https://trello.com/b/YEVVUNMx/roadmap)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

# Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)

## Usage

App plan for Amazon MicroService
Which app did you pick as a target for building a minimal, data-oriented clone? 

We are cloning the back end of Amazon.  Our minimal product consists of prime user API, search/browse API, and an order API as well as an analysis service/events endpoint.  The inventory of products is generated and supplied directly to the search/browse API that populates a cart.  

What is the business question you aim to answer? 

The question we are investigating is: 
“On a week by week basis, do users who spend more than $100 on products at the time of Prime membership signup end up converting to full members (remaining a Prime member longer than the trial period) more often than those who spend less than $100 (incl no purchase made at signups).”


## Requirements

- Node 6.9.x
- Redis 3.2.x
- Postgresql 9.6.x
- etc

## Other Information
The story of how your system converts the major inputs to the major outputs

Elastic search will search through the inventory of products in the Search and Browse service. 
Each product entry from the product list will contain productId, name, and price. 
The user selects a list of products to place into the cart. 
UserId and product info will be sent to the Order service.
The user will be asked if they would like to become full prime member before finalizing the order. 
This information is sent in the form of userId and orderId (if applicable) to the Membership service which holds membership information of trialStartDate, prime_start_date, and ordered. 
The service will store this data in PostgresDB collecting all user membership information.
If the user signed up for membership with a cart of products to buy, the Order service DB will store the order information using Cassandra. 
Each order entry will contain orderId, userId, amount, completion, and a list of productId.
Once the order and membership data is stored, the Order service will send data containing the userId, amount and orderId to the Event service while the Membership service sends information on the membership status of the user in the form of userId.
The Event service stores this data, which ultimately gives valuable insight on how the amount of money spent on a particular purchase influences the user to extend their prime trial membership to a full prime membership.
