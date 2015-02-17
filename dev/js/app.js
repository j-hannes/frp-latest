var Rx = require('rx')
var $ = require('jquery')
var λ = require('hs.js')
var Vue = require('vue')

var requestStream = Rx.Observable.just('https://api.github.com/users')

var fetchData = λ.compose(Rx.Observable.fromPromise, $.getJSON)
var responseStream = requestStream.flatMap(fetchData)

responseStream.subscribe(function(users) {
  new Vue({
    el: '#userList',
    data: {
      title: 'users',
      users: users,
    }
  })
})

