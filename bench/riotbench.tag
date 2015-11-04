<riotbench>
  <button onclick={ reverse }>Reverse</button>
  <div>
    <div>
      <p each={ list }>Item {id}</p>
    </div>
  </div>

  console.log('here')
  var $rendertime = document.getElementById('rendertime')
  this.list = new Array(10000)
  for (var i = 0, len = this.list.length; i < len; i++) {
    this.list[i] = {
      id: i
    }
  }

  reverse() {
    starttime = Date.now()
    this.list.reverse()
    requestAnimationFrame(function () {
      $rendertime.textContent = 'Rendering took ' + (Date.now() - starttime) + ' ms'
    })
    
  }
  requestAnimationFrame(function () {
    $rendertime.textContent = 'Rendering took ' + (Date.now() - starttime) + ' ms'
  })
  
</riotbench>
