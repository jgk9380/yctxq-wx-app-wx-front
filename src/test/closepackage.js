// (1)以下代码中打印的this是个什么对象？
// (2)这段代码能否实现使myNumber.value加1的功能？
// (3)在不放弃helper函数的前提下，有哪些修改方法可以实现正确的功能？

// var myNumber = {
//   value: 1,
//   add: function(i){
//     var helper = function(i){
//       console.log(this);
//       this.value += i;
//     }
//     helper(i);
//   }
// }
// myNumber.add(1);//1
//
// console.log(1);

// 1.this指向window对象（因为匿名函数的执行具有全局性，所以其this对象指向window）；
// 2.不能实现value加1（每个函数在被调用时都会自动取得两个特殊变量，this和arguments，内部函数在搜索这两个对象时，
// 只会搜索到其活动对象为止，所以不能实现访问外部函数的this对象）；
// 3.修改代码实现正确功能


// 3.修改代码实现正确功能
// 第一种方法：
//
// var myNumber={
//   value:1,
//   add:function(i){
//     var that=this;//定义变量that用于保存上层函数的this对象
//     var helper=function(i){
//       console.log(that);
//       that.value+=i;
//       console.log(that.value);
//     }
//     helper(i);
//   }
// }
// myNumber.add(1);


// 第二种方法：

// var myNumber={
//   value:1,
//   add:function(i){
//     var helper=function(i){
//       this.value+=i;
//     }
//     helper.apply(this,[i]);//使用apply改变helper的this对象指向，使其指向myNumber对象
//     console.log(this.value);
//   }
// }
// myNumber.add(1);



// 第三种方法

// var myNumber={
//   value:1,
//   add:function(i){
//     var helper=function(i){
//       this.value+=i;
//     }.bind(this,i);//使用bind绑定，和apply相似，只是它返回的是对函数的引用，不会立即执行
//     helper(i);
//   }
// }
// myNumber.add(1);
//
// console.log(myNumber.value);




// var name = "The Window";
// var object1 = {
//   name: "My object",
//   getNameFunc: function() {
//     return function() {
//       return this.name;
//     };
//   }
// }
// console.log(object1.getNameFunc()()); // "The Window"
//

//
//  name1 = "The Window";
// var object = {
//   name: "My object",
//   getNameFunc: function() {
//     var that = this;   // 将getNameFunc()的this保存在that变量中
//     var age = 15;
//     return function() {
//       return that.name;
//     };
//   }
// }
// console.log(object.getNameFunc()());   // "My object"
//
// console.log(global.name1);
//
//
// console.log( __filename );
// console.log( __dirname );
//
//

var x = 1;

console.log(module.x); // undefined
console.log(exports.x); // undefined
console.log(this.x); // undefined

console.log(this === module); // false
console.log(this === exports); // true
