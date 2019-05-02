# Example Container Native Node.js Application

Demonstrating:

* Tracing
* Unit Tests
* Nodeshift
* local debugging
* Shutdown signal handlers
* Timeouts
* Consistent logging
* Secrets
* Probes
* Software version
* Api versioning
* Swagger


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

Download from https://github.com/Maistra/origin/releases

Start the cluster with 

`istiooc_darwin cluster up`

`oc login -u system:admin`

`oc adm policy add-scc-to-user privileged -z default -n myproject`

`oc project istio-operator`

`oc adm policy add-cluster-role-to-user cluster-admin developer`

`oc create -f istio-installation.yaml`

`nvm use 10.15`

`oc login -u developer`

`oc project myproject`

`oc new-app -e POSTGRESQL_USER=luke -ePOSTGRESQL_PASSWORD=secret -ePOSTGRESQL_DATABASE=my_data openshift/postgresql-92-centos7 --name=my-database`

`npm run openshift`

