"use strict";

treeherder.controller('MainCtrl',
    function MainController($scope, $rootScope, $routeParams, $location, $log,
                            localStorageService, ThRepositoryModel, thPinboard,
                            thClassificationTypes, thEvents) {

        thClassificationTypes.load();
        ThRepositoryModel.load();

        $scope.clearJob = function() {
            // setting the selectedJob to null hides the bottom panel
            $rootScope.selectedJob = null;
        };

        // detect window width and put it in scope so items can react to
        // a narrow/wide window
        $scope.getWidth = function() {
            return $(window).width();
        };
        $scope.$watch($scope.getWidth, function(newValue, oldValue) {
            $scope.windowWidth = newValue;
            $rootScope.$broadcast(thEvents.topNavBarContentChanged);
        });
        window.onresize = function(){
            $scope.$apply();
        };

        $rootScope.$on(thEvents.topNavBarContentChanged, function(ev) {
            var newTopNavHeight = $("th-global-top-nav-panel").find(".navbar-fixed-top").height();
            if ($scope.topNavBarHeight !== newTopNavHeight) {
                $scope.topNavBarHeight = newTopNavHeight;
                $("body").css("padding-top", newTopNavHeight);
            }
        });

        // give the page a way to determine which nav toolbar to show
        $rootScope.$on('$locationChangeSuccess', function(ev,newUrl) {
            $rootScope.locationPath = $location.path().replace('/', '');
        });

        $rootScope.urlBasePath = $location.absUrl().split('?')[0];

        // the repos the user has chosen to watch
        $scope.watchedRepos = ThRepositoryModel.watchedRepos;

        $scope.changeRepo = function(repo_name) {
            // hide the repo panel if they chose to load one.
            $scope.isRepoPanelShowing = false;

            ThRepositoryModel.setCurrent(repo_name);
            $location.search({repo: repo_name});

        };

        $scope.pinboardCount = thPinboard.count;
        $scope.pinnedJobs = thPinboard.pinnedJobs;

        $scope.user = {};
        $scope.user.email = localStorageService.get("user.email");
        $scope.user.loggedin = $scope.user.email !== null;
    }
);
