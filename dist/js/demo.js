$(function () {
    // Invoke Alert Demo
  $('#alert').click(function () {
    $.ShinyModal({
      'modal-type': 'alert',
      'modal-title': 'Alert',
      'modal-contents': 'Contents'
    })
  })

    // Invoke Confirm Demo
  $('#confirm').click(function () {
    $.ShinyModal({
      'modal-type': 'confirm',
      'modal-title': 'Confirm',
      'modal-contents': 'Contents',
      callback: function (e) {
        alert('Are You Sure?')
      }
    })
  })

    // JS Invoke Demo
  $('#modal').on('click', function () {
    $('#mModal').ShinyModal({
      keyEsc: false,
      overlayClick: false
    })
  })
})
