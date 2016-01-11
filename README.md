# L2S2
[![Node](https://img.shields.io/badge/node-%3E%3D4-brightgreen.svg?style=flat-square)](https://npmjs.com)
[![David](https://img.shields.io/david/c3subtitles/L2S2.svg?style=flat-square)](https://david-dm.org/c3subtitles/l2s2)
[![Travis](https://img.shields.io/travis/c3subtitles/L2S2/master.svg?style=flat-square)](https://travis-ci.org/c3subtitles/L2S2)

# Getting Started

## Prerequisite

* Redis
* Postgres
* node >= 4

## Frontend
```
npm install
npm run dev
```

## Backend
Make sure to set the values in the .env file to your needs.  
For initial Data use the following
```
npm run database
```
it will create roles and an admin user.  
Password for the admin user is admin.
```
npm install
npm run devServer
```

## Detailed Informtion
### On GNU/Linux

#### PostgreSQL
You can install PostgreSQL from your distro's repository. The following instructions refer to Sabayon Linux with PostgreSQL v9.4

After that, some adjustments may need be needed in order to start a PostgreSQL server successfully. `systemctl status postgresql-9.4.service` and `journalctl -xe` will point you to that issues.

* `postgresql.conf`:
    `$PGDATA` is the place, where PostgreSQL will look for config files. For my system it's set to `/etc/postgresql/`. I found a sample config file as `/etc/conf.d/postgresql-9.4`.
    `$DATA_DIR` is the place, where PostgreSQL will store the data. On my system it's set to `/var/lib/postgresql/9.4/data`, but `/usr/local/pqsql/data` seem to be used on Ubuntu Linux. Make sure, the user running postgresql has permissions for that directory. You can use `chown` to edit the user/group.
* `pg_hba.conf`: Put the file in `$PGDATA` (I found a sample at `/usr/share/postgresql-9.4/pg_hba.conf.sample`).
* lock files: Create the directory for postgres in `/run/postgresql/` if it does not exist and change the ownership to the user which will run PostgreSQL.

After putting the config files in the right place, you need to initialise the database via `initdb -D "$PGDATA"` (replace "$PGDATA" with the directory manually if it is not set or empty).
Finally start the PostgreSQL server by `postgres -D "$DATA_DIR"`
