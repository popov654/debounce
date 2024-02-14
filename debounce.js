function debounce(func, timeout) {
   var last = 0
   var busy = false
   var need_refresh = false
   var force = false
   var timer = null
   
   return async function() {
      var now = Date.now()
      var cond = now - last > timeout || force
      if (!cond) {
         if (busy) {
            need_refresh = true
            return
         }
         if (!timer) {
            timer = setTimeout(arguments.callee, timeout - (now - last))
         }
      } else {
         force = false
         if (busy) {
            need_refresh = true
            return
         }
         if (timer) {
            clearTimeout(timer)
            timer = null
         }
         busy = true
         try {
            await func.apply(this, arguments)
         } catch (e) {
            console.log(e)
         } finally {
            last = Date.now()
            busy = false
            if (need_refresh) {
               force = true
               setTimeout(arguments.callee, 0)
            }
            need_refresh = false
         }
      }
   }
}