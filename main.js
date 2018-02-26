#!/usr/local/bin/node

const getStdin = require('get-stdin');
const R = require('ramda');
const { processPayment } = require('./lib/payment_process');
const { pool } = require('./lib/dal');
const Raven = require('raven');

'use strict'

if(process.env.SENTRY_DSN) {
    Raven.config(process.env.SENTRY_DSN).install();
};
const raven_report = (e, context_opts) => {
    if(process.env.SENTRY_DSN) {
        Raven.context(function () {
            if(context_opts) {
                Raven.setContext(context_opts);
            };

            Raven.captureException(e, (sendErr, event) => {
                if(sendErr) {
                    console.log('error on log to sentry')
                } else {
                    console.log('raven logged event', event);
                }
            });
        });
    };
};
/*
 * receive notification via stdin and process in some module
 * notification example:
 *
 * - action process_payment:
 *   process a new payment on gateway
 *   {
 *      action: 'process_payment',
 *      id: uuid_v4 for payment,
 *      subscription_id: uuid_v4 for subscription,
 *      created_at: datetime of payment creation,
 *   }
 *
 *  - action generate_card:
 *  process and generate a new card based on valid card_hash
 *  {
 *      action: 'generate_card',
 *      id: uuid_v4 for credit_card
 *  }
 */
const main = async (notification) => {
    console.log('received -> ', notification);
    const jsonNotification = JSON.parse(notification);
    const dbclient = await pool.connect();

    switch (jsonNotification.action) {
        case 'process_payment':
            console.log('processing payment ', jsonNotification.id);
            const { transaction } = await processPayment(dbclient, jsonNotification.id);
            console.log('generate transaction with id ', transaction.id);
            break;
        case 'generate_card':
            break;
        default:
            throw new Error('invalid action');
    };

    dbclient.release();
};
const finishProcessOk = (result) => {
    console.log('finished ok ', result);
    process.exitCode = 0;
    process.exit(0);
};
const finishProcessErr = (result) => {
    console.log('finished with error ', result);
    raven_report(result);
    process.exitCode = 1;
    process.exit(1);
};

getStdin()
    .then((notification) => {
        console.log(notification);
        if(!R.isNil(notification)) {
            main(notification)
                .then(finishProcessOk)
                .catch(finishProcessErr);
        } else {
            console.log('invalid stdin');
            process.exit(1);
        }
    });
