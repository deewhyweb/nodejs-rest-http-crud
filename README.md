# Example Container Native Node.js Application

### Getting Started

#### Running Locally

First, install the dependencies

`npm install`

A Postgres DB is needed, so if you are using Docker, then you can start a postgres db easily.

`docker run --name os-postgres-db -e POSTGRESQL_USER=luke -e POSTGRESQL_PASSWORD=secret -e POSTGRESQL_DATABASE=my_data -d -p 5432:5432  openshift/postgresql-92-centos7`

In this example, the db user is `luke`, the password is `secret` and the database is `my_data`

You can then start the application like this:

`DB_USERNAME=luke DB_PASSWORD=secret npm start`


Then go to http://localhost:8080


#### Running on Minishift

First, make sure you have minishift setup and are logged in using `oc login`.

Then create a new project using the `oc` commands

`oc new-project fun-node-fun`

For this example, you will also need a postgres db running on your Minishift cluster.

`oc new-app -e POSTGRESQL_USER=luke -ePOSTGRESQL_PASSWORD=secret -ePOSTGRESQL_DATABASE=my_data openshift/postgresql-92-centos7 --name=my-database`

Then run `npm run openshift` to deploy your app

Then you can navigate to the newly exposed route, something similar to "http://nodejs-rest-http-crud-boosters.192.168.99.100.nip.io/",  this will probably be different based on your Minishift IP address

oc project istio-operator

oc adm policy add-cluster-role-to-user cluster-admin developer

Deploy istio control pane


oc create -f istio-installation.yaml


nvm use 10.15

oc login -u developer

oc project myproject

npm run openshift

