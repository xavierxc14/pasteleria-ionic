angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('UsuariosCtrl', function($scope, UsuarioFactory) {

  UsuarioFactory.query().$promise.then(
    function succes(respuesta) {
      console.log(respuesta);
      $scope.usuarios = respuesta;
    },
    function error(error) {
      console.log(error);
    });
})

.controller('PastelesCtrl', function($scope, $stateParams, UsuarioFactory, PastelesFactory) {

  $scope.pasteles;

  function buscarPasteles() {
    PastelesFactory.buscarPorIdUsuario({
      idUsuario: $stateParams.usuarioId
    }).$promise.then(
      function success(respuesta) {
        $scope.pasteles = respuesta;
        console.log(respuesta);
      },
      function error(error) {
        console.log(error);
      });
  }
  // buscarPasteles();

  UsuarioFactory.get({
    id: $stateParams.usuarioId
  }).$promise.then(
    function success(respuesta) {
      $scope.usuario = respuesta;
      console.log($scope.usuario);
    },
    function error(error) {
      console.log(error);
    });

  io.socket.get('https://pasteleria-backend-xavierxc14.c9users.io/Pastel',
    function(res, jwres) {
      $scope.pasteles = res;
      $scope.$digest();
    });

  io.socket.on('pastel', function(obj) {
    console.log(obj);

    if (obj.verb === 'created') {
      console.log(obj.data);
      if (obj.data.idUsuario == $stateParams.usuarioId) {
        $scope.pasteles.splice(0, 0, obj.data);
        // $scope.pasteles.push(obj.data);
        $scope.$digest();
      }
    }
    if (obj.verb === 'destroyed') {
      console.log($scope.pasteles);
      for (var x = 0; x < $scope.pasteles.length; x++) {
        console.log(obj);
        if ($scope.pasteles[x].id == obj.id) {
          $scope.pasteles.splice(x, 1);
          break;
        }
      }
      $scope.$digest();
    }
    if (obj.verb === 'updated') {
      console.log($scope.pasteles);
      for (var x = 0; x < $scope.pasteles.length; x++) {
        console.log(obj);
        if ($scope.pasteles[x].id == obj.id) {
          var objeto = obj.data;
          objeto.id = obj.id;
          $scope.pasteles.splice(x, 1, objeto);
          break;
        }
      }
      $scope.$digest();
    }

  })
});
