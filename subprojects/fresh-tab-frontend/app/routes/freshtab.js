import Ember from "ember";

export default Ember.Route.extend({
  cliqz: Ember.inject.service(),
  i18n: Ember.inject.service(),
  messageCenter: Ember.inject.service('message-center'),

  activate() {
    document.title = this.get('i18n').t('title');
    Ember.$('body').addClass('freshTabContainer');
  },

  deactivate() {
    Ember.$('body').removeClass('freshTabContainer');
  },

  beforeModel() {
    const messageCenter = this.get('messageCenter');

    return this.get('cliqz').getConfig().then( config => {
      messageCenter.addMessages(config.messages);
      this.set('config', config);
    });
  },

  model: function() {
    const config = this.get('config');

    return Ember.Object.create({
      miniOnboarding: config.miniOnboarding,
      isBrowser: config.isBrowser,
      showHelp: config.showHelp,
      showFeedback: config.showFeedback,
      showNewBrandAlert: config.showNewBrandAlert,
      messageCenter: this.get('messageCenter'),
    });
  },

  afterModel() {
  },

  actions: {

    toggleBackground() {
      const $background = Ember.$('.optinBackground');

      if($background.hasClass('transparent')) {
        return;
      }

      $background.fadeOut(700)
        .fadeIn(400)
        .delay(100)
        .toggleClass('transparent')
        .removeClass('bgImage');
    },

    openLink(url, telemetry) {
      this.get('cliqz').sendTelemetry({
        "type": "onboarding",
        "product": "cliqz",
        "action": "click",
        "action_target": telemetry,
        "version": "2.0",
      });
      window.open(url,'_blank');
    },

    openModal(modalName) {
      return this.render(modalName, {
        into: "freshtab",
        outlet: "modal"
      });
    },

    closeModal() {
      return this.disconnectOutlet({
        outlet: "modal",
        parentView: "freshtab"
      });
    },

    fullTour() {
      this.get('cliqz').takeFullTour();
    },

    freshTabLearnMore(url) {
      this.get('cliqz').sendTelemetry({
        type: 'home',
        action: 'click',
        target_type: 'onboarding_more'
      });
      window.open(url,'_blank');
    },

    revertBack() {
      this.get('cliqz').sendTelemetry({
        type: 'home',
        action: 'click',
        target_type: 'onboarding_revert'
      });

      this.get('cliqz').revertBack();

      try{
        window.location = 'about:home';
      } catch(e){
        window.location = 'about:blank';
      }
    }
  },
});
