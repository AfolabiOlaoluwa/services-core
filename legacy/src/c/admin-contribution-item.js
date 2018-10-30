import m from 'mithril';
import _ from 'underscore';
import h from '../h';
import adminProject from './admin-project';
import adminContribution from './admin-contribution';
import adminContributionUser from './admin-contribution-user';
import paymentStatus from './payment-status';

const adminContributionItem = {
    oninit: function() {
        return {
            itemBuilder: [{
                component: adminContributionUser,
                wrapperClass: '.w-col.w-col-4'
            }, {
                component: adminProject,
                wrapperClass: '.w-col.w-col-4'
            }, {
                component: adminContribution,
                wrapperClass: '.w-col.w-col-2'
            }, {
                component: paymentStatus,
                wrapperClass: '.w-col.w-col-2'
            }]
        };
    },
    view: function({state, attrs}) {
        return m(
            '.w-row',
            _.map(ctrl.itemBuilder, panel => m(panel.wrapperClass, [
                m(panel.component, {
                    item: args.item,
                    key: args.key
                })
            ]))
        );
    }
};

export default adminContributionItem;
