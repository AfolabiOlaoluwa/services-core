-- Start transaction and plan the tests.
BEGIN;
    -- insert seed data for basic user/platform/project/reward
    \i /specs/sql-support/insert_platform_user_project.sql

    SELECT plan(3);

    SELECT function_returns(
        'payment_service', 'refunded_transition_at', ARRAY['payment_service.catalog_payments'], 'timestamp without time zone' 
    );

    CREATE OR REPLACE FUNCTION test_refunded_transition_at()
    returns setof text language plpgsql
    as $$
        declare
            _payment payment_service.catalog_payments;
            _transition payment_service.payment_status_transitions;
        begin
            -- generate payment
            insert into payment_service.catalog_payments
                (gateway, platform_id, user_id, project_id, data) 
                values ('pagarme', __seed_platform_id(), __seed_first_user_id(), __seed_project_id(), '{}')
                returning * into _payment;

            return next ok(payment_service.refunded_transition_at(_payment.*) is null, 'expect to be null when not have refunded transition');

            -- transition insert transition on payment
            insert into payment_service.payment_status_transitions
                (catalog_payment_id, to_status, from_status)
                values (_payment.id, 'refunded', 'pending')
                returning * into _transition;

            return next ok(payment_service.refunded_transition_at(_payment.*) = _transition.created_at, 'expect to get created_at from refunded transition');
        end;
    $$;

    select test_refunded_transition_at();
ROLLBACK;
