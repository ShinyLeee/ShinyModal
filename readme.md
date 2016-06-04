#ShinyModal

> Modal用法

### 1. data属性调用

```
<a data-toggle="shiny-modal" data-target="#myModal"></a>
```
```
<div id="myModal" class="shiny-modal">
    <div class="shiny-modal-header">
        <span class="close" data-dismiss="shiny-modal">x</span>
        <h1>NORMAL SIZE MODAL</h1>
    </div>
    <div class="shiny-modal-body">
        <div class="contents">
            <p>NO ESC AND OVERLAY CLICK</p>
        </div>
    </div>
    <div class="shiny-modal-footer">
        <a href="#" class="btn primary" data-dismiss="shiny-modal">Close</a>
    </div>
</div>
```
### 2. javascript调用

```
$(function(){
  $('#mModal').ShinyModal({
    keyEsc: false,
    overlayClick: false
  })
})
```
>Alert、Confirm用法

### 1.Alert
```
  $.ShinyModal({
    'modal-type': 'alert',
    'modal-title': 'Alert',
    'modal-contents': 'Contents'
  })
```

### 2.Confirm
```
  $.ShinyModal({
    'modal-type': 'confirm',
    'modal-title': 'Confirm',
    'modal-contents': 'Contents',
     callback: function (e) {
      alert('Confirm?')
    }
  })
  ```
  
 参考了
 [Bootstrap](https://github.com/twbs/bootstrap)
 和
 [simplemodal](https://github.com/plasm/simplemodal)

学习项目