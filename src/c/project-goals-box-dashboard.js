import m from 'mithril';
import _ from 'underscore';
import h from '../h';

const projectGoalsBoxDashboard = {
    controller(args) {
        // @TODO make dynamic
        const currentGoalIndex = m.prop(0);
        const nextGoal = () => {
            if (currentGoalIndex() < args.goalDetails().length - 1) {
                currentGoalIndex((currentGoalIndex() + 1));
            }
        };
        const previousGoal = () => {
            if (currentGoalIndex() > 0) {
                currentGoalIndex((currentGoalIndex() - 1));
                m.redraw();
            }
        };
        return {
            currentGoalIndex,
            nextGoal,
            previousGoal
        };
    },
    view(ctrl, args) {
        const goals = args.goalDetails().length > 0 ? args.goalDetails() : [{
                title: 'N/A',
                value: '',
                description: ''
            }],
            currentGoalIndex = ctrl.currentGoalIndex;

        return m('div',
            m('.card.card-terciary.flex-column.u-marginbottom-10.u-radius.w-clearfix', [
                m('.u-right', [
                    m('button.btn-inline.btn-terciary.fa.fa-angle-left.u-radius.w-inline-block', {
                        onclick: ctrl.previousGoal,
                        class: currentGoalIndex() === 0 ? 'btn-desactivated' : ''
                    }),
                    m('button.btn-inline.btn-terciary.fa.fa-angle-right.u-radius.w-inline-block', {
                        onclick: ctrl.nextGoal,
                        class: currentGoalIndex() === goals.length - 1 ? 'btn-desactivated' : ''
                    })
                ]),
                m('.fontsize-small.u-marginbottom-10',
                    'Metas'
                ),
                m('.fontsize-largest.fontweight-semibold',
                    '75%'
                ),
                m('.meter.u-marginbottom-10',
                    m('.meter-fill')
                ),
                m('.fontcolor-secondary.fontsize-smallest.fontweight-semibold.lineheight-tighter',
                    goals[currentGoalIndex()].title
                ),
                m('.fontcolor-secondary.fontsize-smallest',
                    `R$0 de R$${goals[currentGoalIndex()].value} por mês`
                )
            ])
        );
    }
};

export default projectGoalsBoxDashboard;
