#!/usr/bin/env bash

PGHOME=/var/lib/pgsql
PG_HBA_METHOD=trust
COMMAND="$1"

if [[ $(id -u) != 0 ]]; then
    echo We need root privileges 1>&2
    exit 1
fi

start_server() {
    systemctl stop postgresql
    if ! systemctl start postgresql; then
        postgresql-setup --initdb
        sed -i -f <(
            cat << EOF
s/\(^\(host\|local\)\s\+all\s\+all\s\+.*\s\+\)\(\w\+\)$/\1 $PG_HBA_METHOD/;
EOF
        ) "$PGHOME/data/pg_hba.conf"
        systemctl daemon-reload
        systemctl enable --now postgresql
    fi
}

stop_server() {
    systemctl stop postgresql
}

drop_server_data() {
    find "$PGHOME" -mindepth 1 -maxdepth 1 -execdir rm -rf '{}' +
}

case "$COMMAND" in
start)
    start_server
    ;;
stop)
    stop_server
    ;;
drop)
    stop_server
    drop_server_data
    ;;
*)
    echo start, stop, or drop the postgresql server 1>&2
    ;;
esac
