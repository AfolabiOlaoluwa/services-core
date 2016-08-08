import m from 'mithril';
import _ from 'underscore';
import h from '../h';
import projectVM from '../vms/project-vm';
import projectHeader from '../c/project-header';
import projectTabs from '../c/project-tabs';
import projectMain from '../c/project-main';
import projectDashboardMenu from '../c/project-dashboard-menu';

const projectsShow = {
    controller(args) {
        h.analytics.windowScroll({cat: 'project_view',act: 'project_page_scroll'});
        return projectVM(args.project_id, args.project_user_id);
    },
    view(ctrl, args) {
        const project = ctrl.projectDetails;

        return m('.project-show', [
                m.component(projectHeader, {
                    project: project,
                    userDetails: ctrl.userDetails
                }),
                m.component(projectTabs, {
                    project: project,
                    rewardDetails: ctrl.rewardDetails
                }),
                m.component(projectMain, {
                    project: project,
                    post_id: args.post_id,
                    rewardDetails: ctrl.rewardDetails
                }),
                (project() && project().is_owner_or_admin ? m.component(projectDashboardMenu, {
                    project: project
                }) : '')
            ]);
    }
};

export default projectsShow;
