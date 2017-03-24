'use strict';

var shopController = angular.module('shopController',[
  'ngMaterial',
  'ngCookies',
  'ui.bootstrap',
  'ngResource',
  'ngRoute',
  ]);

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
  };

shopController.controller('StyleController', ['$scope', 'StyleService',
  function ($scope,StyleService) {
    StyleService.success (function (data) {
      $scope.style = data;
    });
  }]);

shopController.controller('SignUpController', ['$http', '$scope','$location', 'SignUpService',
  function ($http, $scope, $location, SignUpService) {
    $scope.user = {};
    $scope.sign_up = function () {
      var user_detail = $scope.user;
      SignUpService.sign_up(user_detail).then(function (data) {
        $scope.data = data;
        if (angular.equals($scope.data.status, 200))
          $location.url('/shop');
      });
    };
  }]);

shopController.controller('CheckoutController', ['$scope', '$http', 'GuestCheckoutService',
  'UpdateCustomerService', '$location', '$rootScope',
  function ($scope, $http, GuestCheckoutService, UpdateCustomerService, $location, $rootScope) {
    $scope.emailCheckout = function () {
      GuestCheckoutService.chechout($scope.customer).then(function (data) {
        $rootScope.customer = data;
        $location.url('/payment');
      });
    };
    $scope.updateCustomer = function () {
      UpdateCustomerService.updateCustomer($scope.customer, $scope.customer.id).then(function (data) {
        $rootScope.updatedCustomer = data;
        // $location.url('/payment');
      });
    };
  }]);

shopController.controller('ProductController',
  ['$rootScope', '$scope', '$http', 'ProductService', 'SexService', 'CategoryService',
  'ProducerService','SearchService', '$mdDialog','ShoppingCartService','$cookieStore', 'OrderService',
	function ($rootScope, $scope, $http, ProductService, SexService, CategoryService,
   ProducerService, SearchService, $mdDialog, cart,$cookieStore, OrderService) {

    //pagination
    $scope.page = 1;
    $scope.products_storage = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 9;
    $scope.predicate = 'name';
    $scope.reverse = true;
    $scope.currentPage = 1;
    $scope.order = function (predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
    };

    // return sex data
    SexService.success(function(data){
      $scope.sexes = data;
    });

    // return category data
    CategoryService.success(function(data){
      $scope.categories = data;
    });

    // return producer data
    ProducerService.getProducer().then(function(data){
      $scope.producers = data;
    });

    $scope.emailCheckout = function () {
    };
    $scope.search_product = function (data, page) {
      SearchService.search(data, page).then(function (data) {
        $rootScope.products = data;
        if (data[0] != undefined) {
          $scope.totalItems = data[0].total_count;
        }
        $scope.selectcolor;
      });
    };
    $scope.search_product();
    $scope.getPage = function () {
      $scope.search_product($scope.params_search, $scope.currentPage);
    };
    $scope.search_product_with_params = function(data) {
      $scope.params_search = data;
      $scope.currentPage = 1;
      return $scope.search_product($scope.params_search, $scope.currentPage);
    }
    // Initialize the cart
    cart.init('products_selected');
    $scope.products_selected = cart.getAll();
    $scope.addProduct = function (index, quantity, size, color, itsQuantity) {
      $scope.itsQuantity = itsQuantity;
      if(quantity === undefined) quantity = 1;
      if (!cart.checkItem( $rootScope.products[index] )) {
        $scope.subPrice = quantity*$rootScope.products[index].price;
        cart.addItem($rootScope.products[index], quantity, size, color, $scope.subPrice, $scope.itsQuantity);

      }
      else {

      }
    }
    $scope.removeProduct = function (index) {
      cart.removeItem($scope.products_selected[index]);
      $scope.products_selected.splice(index,1);
      $scope.totalPrice = cart.totalPrice();
    }
    $scope.changeQuantity = function (index) {
      cart.updateQuantity(index, $scope.products_selected[index].quantity);
      $scope.products_selected = cart.getAll();
      $scope.totalPrice = cart.totalPrice();
    }

    $scope.totalPrice = cart.totalPrice();
    $scope.ship = {
        firstname: "",
        lastname: "",
        email: "",
        address: "",
        phone: "",
        country: "",
        city: ""
    };
    $scope.showTab = function(ev,id) {
      // var fashion = $scope.fashions.indexOf(fashion);
      $mdDialog.show({
        controller: DialogController,
        contentElement: '#content' + id,
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    };
    $scope.selectColor = function (color) {
      $scope.selectcolor = color;
    };
    $scope.deleteCookies = function () {
      cart.deleteAll();
    };
  }]);

shopController.controller('CustomerController', ['$scope', '$http', 'CustomerService', 'ShowBillDetailsService',
 '$location', '$rootScope', '$window', '$cookieStore', 'ShoppingCartService', 'CreateBillService', 'ShowAllBillService',
  function ($scope, $http, CustomerService, ShowBillDetailsService, $location,
   $rootScope, $window, $cookieStore, cart, CreateBillService, ShowAllBillService) {
    if ($rootScope.current_user) {
      var session = $cookieStore.get('authen_token')[0];
      CustomerService.show(session.user_id, session.authen_token).then (function (data) {
        $rootScope.currentCustomer = data;
      })
    }
    $scope.updateCustomerInfomation = function () {
      CustomerService.updateCustomer($scope.updateCustomer, $rootScope.currentCustomer.id).then(function (data) {
        $rootScope.currentCustomer = data;
        // $location.url('/payment');
      });
    };

    $scope.createCustomer = function () {
      CustomerService.create($scope.customer).then(function (data) {
        $rootScope.currentCustomer = data;
        $location.url('/payment');
      });
    };

    cart.init('products_selected');
    $scope.totalPrice = cart.totalPrice();
    $scope.prodcutSelected = cart.getAll();

    $scope.currencyExchange = function () {
      if ($scope.payByMoney == "Vietnamese Dong") {
        $scope.totalByMoney = $scope.totalPrice*21000;
        $scope.finalMoney = $scope.totalByMoney.toString() + " VND";
        return $scope.finalMoney;
      }
      else if ($scope.payByMoney == "Dollars") {
        $scope.totalByMoney = $scope.totalPrice;
        $scope.finalMoney = $scope.totalByMoney.toString() + " USD";
        return $scope.finalMoney;
      }
      else if ($scope.payByMoney === "Japanese Yen") {
        $scope.totalByMoney = $scope.totalPrice/0.009795;
        $scope.finalMoney = $scope.totalByMoney.toString() + " YEN";
        return $scope.finalMoney;
      } else {};
    };

    $scope.createBill = function () {
      CreateBillService.createBillAndBillDetails($rootScope.currentCustomer, $scope.prodcutSelected, $scope.finalMoney).then(function(data) {
        $scope.createBill = data;
      });
      $cookieStore.remove("products_selected");
      alert("Your purchase is done! Thank you and see you again!");
      // $location.url('/shop');
      // $window.location.reload('/shop');
    };

    $scope.showBill = function () {
      console.log($rootScope.currentCustomer.id);
      ShowAllBillService.showAllBill($rootScope.currentCustomer.id).then(function(data) {
        $scope.getTime = data.created_times;
        $scope.getPrice = data.prices;
        $scope.getBillId = data.bills_id;
        $rootScope.bills = [];
        for (var i = 0, length = $scope.getTime.length; i < length; i++) {
          var dayOfBill = $scope.getTime[i].substring(0,10);
          var timeOfBill = $scope.getTime[i].substring(11,19);
          var priceOfBill = $scope.getPrice[i];
          var idOfBill = $scope.getBillId[i];
          var stt = i + 1;
          var billInfomation = {
            "stt" : stt,
            "day" : dayOfBill,
            "time" : timeOfBill,
            "price" : priceOfBill,
            "id" : idOfBill
          }
          $rootScope.bills.push(billInfomation);
        };
      });
    };

    $scope.getBillDetails = function (billId) {
      $scope.billId = billId;
      ShowBillDetailsService.showPurchaseHistory($scope.billId).then(function(data) {
        $scope.billsDetails = data.allBillsDetails;
        console.log($scope.billsDetails);
      });
    };
  }]);

shopController.controller('SignInController', ['$http', '$scope', '$location','$window',
 'SignInService', '$cookieStore', 'AuthenTokenService',
  function ($http, $scope, $location, $window, SignInService, $cookieStore, authen_token) {
    $scope.sign_in = function () {
      authen_token.init('authen_token');
      var session = $scope.session;
      SignInService.sign_in(session).then(function (data) {
        $scope.data = data;
        if (angular.equals($scope.data.status, 200)){
          authen_token.addItem(data);
          if (session.signin_in_checkout == '1') {
            $location.url('/payment');
            $window.location.reload('/payment');
          }
          else
            $location.url('/shop');
            $window.location.reload('/shop');
        }
      });
    };
  }]);

shopController.controller('SignOutController', ['$http', '$scope', '$window',
 'SignOutService', '$cookieStore', 'AuthenTokenService',
  function ($http, $scope, $window, SignOutService, $cookieStore, authen_token) {
    $scope.sign_out = function () {
      var session = {
        user_id: $cookieStore.get('authen_token')[0].user_id,
        authen_token: $cookieStore.get('authen_token')[0].authen_token
      }
      SignOutService.sign_out(session).then(function (data) {
        $scope.data = data;
        if (angular.equals($scope.data.status, 200)) {
          $cookieStore.remove("authen_token");
          $window.location.reload('/shop');
        }
        else {
          alert("Your account is logged in from another computer");
          $cookieStore.remove("authen_token");
          $window.location.reload('/shop');
        }
      });
    };
  }]);

shopController.controller('SentTokenResetToServerController', ['$http', '$scope', '$location',
  'SentTokenResetToServerService',
  function ($http, $scope, $location, SentTokenResetToServerService) {
    var paramValue = $location.search();
    SentTokenResetToServerService.sent_reset_token(paramValue).then( function (data) {
      if (data.success === true) {
        $location.url('/change_password?password_reset_token=' + data.id + '&email=' + data.email);
      }
    });
  }]);

shopController.controller('PasswordResetController', ['$http', '$scope',
  '$window', 'PasswordResetService', '$location',
  function ($http, $scope, $window, PasswordResetService, $location) {
    $scope.sent_mail = function () {
      var password_reset = $scope.password_reset;
      PasswordResetService.sent_mail(password_reset).then( function (data) {
        $scope.data = data;
        if (data.success == true) {
          $scope.flag = true;
        }
        else $scope.flag = false;
        });
      };
    $scope.change_password = function () {
      var param_value = $location.search();
      var password_reset = $scope.password_reset;
      PasswordResetService.change_password(param_value, password_reset).then ( function (data) {
        $scope.data = data
        if ($scope.data.success === true) {
          $window.location.reload('/shop');
        }
      });
    }
    }]);

shopController.run(['$rootScope', '$cookieStore',
  function($rootScope, $cookieStore) {
    $rootScope.current_user;
    if (angular.isUndefined($cookieStore.get('authen_token'))){
      $rootScope.current_user = false;
    }
    else{
      if ($cookieStore.get('authen_token').length == 0) {
        $rootScope.current_user = false;
      }
      else
        $rootScope.current_user = true;
    }
  }]);
