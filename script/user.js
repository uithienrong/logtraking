function delUser(id) {
    $.post('/users/delete', {id: id})
}