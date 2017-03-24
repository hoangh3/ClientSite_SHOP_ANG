'use strict';

var shopService = angular.module ('shopService',[
  'ngCookies'
]);
var address_server = 'http://localhost:3000/v1';

//parse data
var param = function(obj) {
  var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
  for(name in obj) {
    value = obj[name];

    if(value instanceof Array) {
      for(i=0; i<value.length; ++i) {
        subValue = value[i];
        fullSubName = name + '[' + i + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += param(innerObj) + '&';
      }
    }
    else if(value instanceof Object) {
      for(subName in value) {
        subValue = value[subName];
        fullSubName = name + '[' + subName + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += param(innerObj) + '&';
      }
    }
    else if(value !== undefined && value !== null)
      query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
  }

  return query.length ? query.substr(0, query.length - 1) : query;
  };

shopService.factory('SexService', ['$http', '$q', function($http, $q){
  return $http.get(address_server + '/sexes')
  .success(function(data){
    return data;
  })
  .error(function(err){
    return err;
  })
  }]);

shopService.factory('ProducerService', ['$http', '$q', function($http, $q){
  var service = {};
  service.getProducer = function () {
    var defer = $q.defer();
    $http.get(address_server + '/producers')
    .success(function(data){
      defer.resolve(data);
    })
    .error(function(err){
      defer.reject(error);
    });
    return defer.promise;
  };
  return service;
  }]);

shopService.factory('CategoryService', ['$http', '$q', function($http, $q){
  return $http.get(address_server + '/categories')
  .success(function(data){
    return data;
  })
  .error(function(err){
    return err;
  })
  }]);

shopService.factory('ProductService', ['$http', '$q', function($http, $q){
  return $http.get(address_server + '/products')
  .success(function(data){
    return data;
  })
  .error(function(err){
    return err;
  })
  }]);

shopService.factory('CreateBillService', ['$http', '$q', function($http, $q){
  var service = {};
  service.createBillAndBillDetails = function (user, shoppingCart, totalMoney) {
    var defer = $q.defer();
    $http(
    {
      method: 'POST',
      url: address_server + '/bills',
      data: {user: user,
            shoppingCart: shoppingCart,
            totalMoney: totalMoney},
      cache: false
    })
    .success(function (data, status, headers, config) {
      defer.resolve(data);
    }).error(function (error) {
      defer.reject(error);
    });
    return defer.promise;
  };
  return service;
  }]);

  shopService.factory('ShowAllBillService', ['$http', '$q', function($http, $q){
    var service = {};
    service.showAllBill = function (userId) {
      var defer = $q.defer();
      $http(
      {
        method: 'GET',
        url: address_server + '/bills/' + userId,
        cache: false
      })
      .success(function (data, status, headers, config) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
      });
      return defer.promise;
    };
    return service;
    }]);

shopService.factory('ShowBillDetailsService', ['$http', '$q', function($http, $q){
  var service = {};
  service.showPurchaseHistory = function (billId) {
    console.log(billId);
    var defer = $q.defer();
    $http(
    {
      method: 'POST',
      url: address_server + '/show_bills_details',
      data: {bill_id: billId},
      cache: false
    })
    .success(function (data, status, headers, config) {
      defer.resolve(data);
    }).error(function (error) {
      defer.reject(error);
    });
    return defer.promise;
  };
  return service;
  }]);

shopService.factory ('SearchService', ['$http', '$q', function($http, $q) {
  var service = {};
  service.search = function (data, page) {
    var defer = $q.defer();
    $http(
    {
      method: 'GET',
      url: address_server+'/products?page=' + page,
      params: data,
      cache: false
      })
      .success(function (data, status, headers, config) {
        defer.resolve(data);
      }).error(function (error) {
        defer.reject(error);
    });
    return defer.promise;
  };
  return service;
  }]);

shopService.factory ('OrderService', ['$http', '$q', function($http,$q) {
  var service = {};
  service.sent_bill_detail_information = function (customer_id, productID_with_quantity) {
    var defer = $q.defer();
    $http(
    {
      method: 'POST',
      url: address_server + '/orders',
      data: { customer_id: customer_id,
              orders: productID_with_quantity},
      cache: false
    })
    .success (function (data) {
      defer.resolve(data);
    })
    .error (function (error) {
      defer.reject(error);
    });
    return defer.promise;
  };
  return service;
  }]);

shopService.factory ('StyleService', ['$http', function($http) {
  return $http.get ('js/database/style.json')
  .success( function (data) {
    return data;
  }).error( function (err) {
    return err;
  });
  }]);

shopService.factory ('ShoppingCartService', ['$cookieStore',
  function (cookies) {
    var cart = {
      itemsCookie: '',
      init: function (itemsCookie) {
        // set itemsCookie
        this.itemsCookie = itemsCookie;

        // if cookie not defined -> put an empty array
        if(! (cookies.get(this.itemsCookie) instanceof Array)) {
          cookies.put(this.itemsCookie, []);
        }
      },
      getAll: function () {
        return cookies.get(this.itemsCookie);
      },
      addItem: function (item, quantity, size, color, subPrice, itsQuantity) {
        // set default value for quantity
        console.log(itsQuantity);
        if(quantity === undefined) quantity = 1;
        if(size === undefined) size = item.size_array_style[0];
        if(color === undefined) color = item.color_array_style[0];
        // add new item vao items
        var items = cookies.get(this.itemsCookie);
        items.push({
          id: item.id,
          name: item.name,
          image: item.image,
          quantity: parseInt(quantity),
          price: item.price,
          size: size,
          color: color,
          subPrice: subPrice,
          itsQuantity: itsQuantity
        });

        console.log(items);
        // put items vao cookies
        cookies.put(this.itemsCookie, items);
      },
      checkItem: function (item) {
        var items = cookies.get(this.itemsCookie);
        for(var i = 0; i < items.length; i++) {
          if(item.id === items[i].id) return true;
        }
        return false;
      },
      getItemByIndex: function (index) {
        var items = cookies.get(this.itemsCookie);
        return items[index];
      },
      getItemById: function (id) {
        var items = cookies.get(this.itemsCookie);
        for(var i = 0; i < items.length; i++) {
          if(items[i].id === id) return items[i];
        }
      },
      updateQuantity: function (index, quantity) {
        var items = cookies.get(this.itemsCookie);
        items[index].quantity = quantity;
        items[index].subPrice = quantity * items[index].price;
        cookies.put(this.itemsCookie, items);
      },
      removeItem: function (index) {
        var items = cookies.get(this.itemsCookie);
        items.splice(index, 1);
        cookies.put(this.itemsCookie, items);
      },
      deleteAll: function () {
        var cookies_all = this.getAll();
        for(var index = cookies_all.length -1; index >= 0 ; index--) {
          this.removeItem(index);
        }
      },
      totalItems: function () {
        var quantity = 0;
        var items = cookies.get(this.itemsCookie);
        for(var i = 0; i < items.length; i++) {
          quantity += items[i].quantity;
        }
        return quantity;
      },
      totalPrice: function () {
        var total = 0
        var items = cookies.get(this.itemsCookie);
        for(var i = 0; i < items.length; i++) {
          total += items[i].subPrice;
        }
        return total;
      }
    }
    return cart;
  }]);

shopService.factory('SignUpService', ['$http', '$q',
  function ($http, $q) {
    var service = {};
    service.sign_up = function (user_detail) {
      var defer = $q.defer();
      $http(
      {
        method: 'POST',
        url: address_server + '/users',
        data: {user: user_detail},
        cache: false
      })
      .success (function (data) {
        defer.resolve(data);
      })
      .error (function (error) {
        defer.reject(error);
      });
      return defer.promise;
    };
  return service;
  }]);

shopService.factory('CustomerService', ['$http','$q', function($http, $q){
  var service = {};
  service.create = function(obj) {
    var defer = $q.defer();
    $http({
      method: 'POST',
      url:    'http://localhost:3000/v1/customers',
      data:   param(obj),
      headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .success(function(data) {
      defer.resolve(data);
      })
    .error (function (error) {
      defer.reject(error);
    });
    return defer.promise;;
    };

    service.updateCustomer = function(obj, id) {
      var defer = $q.defer();
      $http({
        method: 'PATCH',
        url: 'http://localhost:3000/v1/customers/' + id,
        data: param(obj),
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .success(function(data) {
        defer.resolve(data);
        })
      .error (function (error) {
        defer.reject(error);
      });
    return defer.promise;;
    };

    service.show = function (id, authen_token) {
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: address_server+ '/customers/' + id,
        params: {authen_token: authen_token},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .success (function (data) {
        defer.resolve(data);
      })
      .error (function (error) {
        defer.reject(data);
      });
      return defer.promise;
    }
  return service;
  }]);

shopService.factory('AuthenTokenService', ['$cookieStore',
  function (cookies) {
    var authen_token = {
      itemsCookie: '',
      init: function (itemsCookie) {
        // set itemsCookie
        this.itemsCookie = itemsCookie;

        // if cookie not defined -> put an empty array
        if(! (cookies.get(this.itemsCookie) instanceof Array)) {
          cookies.put(this.itemsCookie, []);
        }
      },
      getAll: function () {
        return cookies.get(this.itemsCookie);
      },
      addItem: function (item) {
        // add new item vao items
        var items = cookies.get(this.itemsCookie);
        items.push({
          user_id: item.user_id,
          authen_token: item.token
        });
        // put items vao cookies
        cookies.put(this.itemsCookie, items);
      },
      getItemByIndex: function (index) {
        var items = cookies.get(this.itemsCookie);
        return items[index];
      },
      checkItem: function (item) {
        var items = cookies.get(this.itemsCookie);
        for(var i = 0; i < items.length; i++) {
          if(item.id === items[i].id) return true;
        }
        return false;
      },
      removeItem: function (index) {
        var items = cookies.get(this.itemsCookie);
        items.splice(index, 1);
        cookies.put(this.itemsCookie, items);
      },
      deleteAll: function () {
        var cookies_all = this.getAll();
        for(var index = cookies_all.length -1; index >= 0 ; index--) {
          this.removeItem(index);
        }
      }
    };
    return authen_token;
  }]);

shopService.factory('SignInService', ['$http', '$q',
  function ($http, $q) {
    var service = {};
    service.sign_in = function (session) {
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: address_server + '/sessions',
        data: {session: session},
        cache: false
      })
      .success (function (data) {
        defer.resolve(data);
      })
      .error (function (error) {
        defer.reject(error);
      });
      return defer.promise;
    };
  return service;
  }]);

shopService.factory('SignOutService', ['$http', '$q',
  function ($http, $q) {
    var service = {};
    service.sign_out = function (session) {
      var defer = $q.defer();
      $http({
        method: 'DELETE',
        url: address_server + '/signout',
        data: {session: session},
        headers: {'Content-Type': 'application/json' },
        cache: false
      })
      .success (function (data) {
        defer.resolve(data);
      })
      .error (function (error) {
        defer.reject(error);
      });
      return defer.promise;
    };
  return service;
  }]);

shopService.factory('SentTokenResetToServerService', ['$http', '$q',
  function ($http, $q) {
    var service = {};
    service.sent_reset_token = function (data) {
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: address_server + '/password_resets/' + data.id + '/edit',
        params: {password_reset_token: data.id,
                  email: data.email
                },
        cache: false
      })
      .success (function (data) {
        defer.resolve(data);
      })
      .error (function (error) {
        defer.reject(error);
      });
      return defer.promise;
    };
    return service;
  }]);

shopService.factory('PasswordResetService', ['$http', '$q',
  function ($http, $q) {
    var service = {};
    service.sent_mail = function (data) {
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: address_server + '/password_resets',
        data: {password_reset: data},
        headers: {'Content-Type': 'application/json' },
        cache: false
      })
      .success (function (data) {
        defer.resolve(data);
      })
      .error (function (error) {
        defer.reject(error);
      });
      return defer.promise;
    };
    service.change_password = function (data, password_reset) {
      var defer = $q.defer();
      $http({
        method: 'PATCH',
        url: address_server + '/password_resets/' + data.password_reset_token,
        data: { email: data.email,
                password_reset: password_reset
                },
        headers: {'Content-Type': 'application/json' },
        cache: false
      })
      .success (function (data) {
        defer.resolve(data);
      })
      .error (function (error) {
        defer.reject(error);
      });
      return defer.promise;
    };
    return service;
  }]);
