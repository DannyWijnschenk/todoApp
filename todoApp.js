var ToDoApp   = angular.module('ToDoApp',   ['ngResource']);
 
HostURL = function() {
    return "http://127.0.0.1:57772/csp/user/rest/api/"
    };

ToDoApp.factory('restToDo', function($resource) {
    return $resource(
		HostURL() + "todo/:id", {}, {
		query: { method: "GET", isArray: false },
		update: { method: "POST", params : {id : '@id'} },
		remove: { method: "DELETE", params : {id : '@id'} }
		});
});


ToDoApp.controller('ToDoController', ['$scope', 'restToDo', function($scope, restToDo) {
   
    console.log("ToDoController");
   
    $scope.getToDos = function(id) {
	    console.log('getToDos');
		restToDo.query({id:id}, function(data) {
		  	$scope.todos = data.children;
	    	console.log(data.children,'getToDos');
		});
    };

	$scope.getToDos('');
	
	$scope.selectToDo = function(index) {
		$scope.selectedRow = index;
		console.log('row',index);
	};
	
	$scope.newToDo = function(description) {
		var todo = {'Description' : description, 'Active' : true};
		console.log(todo);
	  	restToDo.update({id:''}, todo, function(data) {
			console.log(data,'saved');
			todo.ID = data.id;
	  		$scope.todos.push(todo);
	  		$scope.inputNew.description = '';
	  		console.log($scope.todos);
		});
	};
	
    $scope.deleteToDo = function(todo, index) {
	    console.log('deleteToDo:',todo);
		restToDo.remove({id:todo.ID}, function(data) {
		  $scope.todos.splice(index,1);
		});
    };

    $scope.saveToDo = function(todo) {
	    console.log('saveToDo:',todo);
		restToDo.update({id:todo.ID}, todo, function(data) {
			console.log(data,'saved');
		});
    };

    $scope.toggleActive = function(todo) {
	    console.log('toggleToDo:',todo);
	    todo.Active = !todo.Active;
		restToDo.update({id:todo.ID}, todo, function(data) {
			console.log(data,'saved');
		});
    };
    
 }]);


ToDoApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});