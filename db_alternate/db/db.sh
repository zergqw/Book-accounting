#!/usr/bin/env bash

PGUSER=postgres
PGDATABASE=booksdb
PGHOME=/var/lib/pgsql
SCRIPTSDIR=$PGHOME/$PGDATABASE-scripts
BACKUPFILE=backup.sql
COMMAND="$1"
shift

export PGUSER
export PGDATABASE

su_pg() {
    sudo -u "$PGUSER" "$@"
}

create_db() {
    if ! su_pg createdb "$PGDATABASE"; then
        su_pg dropdb "$PGDATABASE"
        su_pg createdb "$PGDATABASE"
    fi
    su_pg mkdir -p "$SCRIPTSDIR"
    sudo cp "$1" "$SCRIPTSDIR"
    su_pg psql "$PGDATABASE" -f "$SCRIPTSDIR/$(basename "$1")"
}

drop_db() {
    su_pg dropdb "$PGDATABASE"
}

dump_db() {
    su_pg pg_dump "$PGDATABASE" > "$BACKUPFILE"
}

populate_db() {
    echo populate
}

run() {
    case "$COMMAND" in
    create)
        create_db "${1:?}"
        ;;
    drop)
        drop_db
        ;;
    backup)
        dump_db
        ;;
    populate)
        populate_db "${1:?}"
        ;;
    *)
        echo create, populate, or drop the postgresql server 1>&2
        ;;
    esac
}

run "$@"
