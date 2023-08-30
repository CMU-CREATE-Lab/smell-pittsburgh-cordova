var CommunityGuidelines = {

  text: null, //the text for the page's template
  didInitialLoad: false,


  loadTemplate: function() {
    this.text = App.text.communityguidelines;
    var communityguidelinesTpl = Handlebars.compile($("#communityguidelines-tpl").html());
    $('#communityguidelines').html(communityguidelinesTpl(this.text));
    $('#communityguidelines').trigger('create');
  },


  setListeners: function() {
    // add back (x) button functionality
    $(".back-x").click(function() {App.navigateToPastPage()});
  },


  onCreate: function() {
    if (!CommunityGuidelines.didInitialLoad) {
      CommunityGuidelines.didInitialLoad = true;
      this.loadTemplate();
      this.setListeners();
    }
  },


  initialize: function () {
    console.log("CommunityGuidelines.initialize (deprecated; start using onCreate instead)");
    CommunityGuidelines.onCreate();
  },


  // helper functions

}
