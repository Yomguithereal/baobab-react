 var arraysDiffer = function(a, b) {
   var isDifferent = false;
   if (a.length !== b.length) {
     isDifferent = true;
   } else {
     a.forEach(function(item, index) {
       if (!isSame(item, b[index])) {
         isDifferent = true;
       }
     }, this);
   }
   return isDifferent;
 };

 var objectsDiffer = function(a, b) {
   var isDifferent = false;
   if (Object.keys(a).length !== Object.keys(b).length) {
     isDifferent = true;
   } else {
     Object.keys(a).forEach(function(key) {
       if (!isSame(a[key], b[key])) {
         isDifferent = true;
       }
     }, this);
   }
   return isDifferent;
 };

 var isSame = function(a, b) {

   if (!a || !b) {
     return a === b;
   }

   if (Array.isArray(a)) {
     return !arraysDiffer(a, b);
   } else if (typeof a === 'object' && a !== null) {
     return !objectsDiffer(a, b);
   }

   return a === b;
 };

 module.exports = isSame;
