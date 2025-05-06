#!/usr/bin/env bash

if type -pP dnf; then
    dnf install postgresql postgresql-private-libs postgresql-server
    exit
fi
if type -pP apt; then
    apt install postgresql postgresql-private-libs postgresql-server
    exit
fi
