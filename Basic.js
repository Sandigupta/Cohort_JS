// Write a function sum that finds the sum of two numbers. 
// Side quest - Try passing in a string instead of a number and see what happens?
function sum(a,b){
   return a+b;
}

const result=sum("1","2");
console.log(result);


// Assignment #2
// Write a function called canVote that returns true or false if the age of a user is > 18
function canVote(age){
   if(age>=18){
      return true;
   }else{
      return false;
   }
}

console.log(canVote(35));

// Assignment
// Write an if/else statement that checks if a number is even or odd. If it's even, print "The number is even." Otherwise, print "The number is odd."


// Assignment
// Write a function called sum that finds the sum from 1 to a number
function sum(n){
   let result=0;
   for(let i=1;i<=n;i++){
      result+=i;
   }
   return result;
}

console.log(sum(10));