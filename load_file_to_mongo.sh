#!/bin/sh

mongoimport -h ds157320.mlab.com --port=57320 -u test174 -p 174test -d test_db --drop -c violations --file=violations.json