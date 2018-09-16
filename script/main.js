/*
Please consider that the JS part isn't production ready at all, I just code it to show the concept of merging filters and titles together !
*/
$(document).ready(function(){
    $('.filterable .btn-filter').click(function(){
        var $panel = $(this).parents('.filterable'),
        $filters = $panel.find('.filters input'),
        $tbody = $panel.find('.table tbody');
        if ($filters.prop('disabled') == true) {
            $filters.prop('disabled', false);
            $filters.first().focus();
        } else {
            $filters.val('').prop('disabled', true);
            $tbody.find('.no-result').remove();
            $tbody.find('tr').show();
        }
    });

	$('.filters input').keyup(function(e){
            /* Ignore tab key */
            var code = e.keyCode || e.which;
            if (code == '9') return;
            /* Useful DOM data and selectors */
            var elements = document.getElementsByClassName("form-control");
            var table = '#mytable';
            var count = 0;
            $(table+' tr:gt(0)').each(function(){
                var $tds = $(this).find('td');
                if($tds != null){
                    var enable = true;
                    for(var i = 0 ; i < $tds.length; i++){
                        if(elements[i].value.length > 0){
                            if($tds[i].innerText.indexOf(elements[i].value) <= -1){
                                enable = false;
                                break;
                            }
                        }
                    }
                    if(enable){
                        $(this).show()
                        count ++;
                    }else{
                        $(this).hide()
                    }
                }
            })
            document.getElementById('total').innerHTML = count;

    });


});

function management(arg1, arg2, arg3) {
    var tr = arg1.parentNode.parentNode;
    if(arg2 == 'edit'){
        $(tr).find('td.update').show();
        $(tr).find('td.cancel').show();
        $(tr).find('td.edit').hide();
        $(tr).find('td.delete').hide();
        var arr_value = [];

        $(arg1).parents('tr').find('td.item').each(function () {
            arr_value.push($(this).text())
            var html = $(this).html();
            var input = $('<input class="editItem" type="text" />');
            input.val(html);
            $(this).html(input);
        })
        var key = $(arg1).parents('tr').find('td')[0].innerText;
        $('#backup_data').append('<input type="hidden" name="'+ key +'" value="'+ arr_value +'"></input>');

    }else if(arg2 == 'update'){
        $(tr).find('td.update').hide();
        $(tr).find('td.cancel').hide();
        $(tr).find('td.edit').show();
        $(tr).find('td.delete').show();

        var datas = []
        $(arg1).parents('tr').find('td.item').each(function () {
            var input = $(this).find('input');
            var text = input.val();
            this.innerHTML = text;
            datas.push(text)
            input.remove();
        })

        var id = $(arg1).parents('tr').find('td')[0].innerText;
        $('#backup_data input[name="'+ id +'"]').remove();


        var id_obj = $(arg1).parents('tr').find('input')[0].value;
        url = '';
        if(arg3 == 'module'){
            url = '/inventory/module/update/' + id_obj;
        }else if (arg3 == 'uart'){
            url = '/inventory/uart.js/update/' + id_obj;
        }else if (arg3 == 'devkit'){
            url = '/inventory/devkit/update/' + id_obj;
        }else if (arg3 == 'usb'){
            url = '/inventory/usb/update/' + id_obj;
        }else if (arg3 == 'powersupply.js'){
            url = '/inventory/powersupply.js/update/' + id_obj;
        }else if (arg3 == 'sim'){
            url = '/inventory/sim/update/' + id_obj;
        }else if (arg3 == 'anthena'){
            url = '/inventory/anthena/update/' + id_obj;
        }else if (arg3 == 'other'){
            url = '/inventory/other/update/' + id_obj;
        }

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            data: {module: datas},
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            }
        });

    }else if(arg2 == 'cancel'){
        $(tr).find('td.update').hide();
        $(tr).find('td.cancel').hide();
        $(tr).find('td.edit').show();
        $(tr).find('td.delete').show();

        var id = $(arg1).parents('tr').find('td')[0].innerText;
        var str_bk = $('#backup_data input[name="'+ id +'"]').val();
        var arr_bk = str_bk.split(",");

        $(arg1).parents('tr').find('td.item').each(function (i) {
            $(this).find('input').remove();
            this.innerHTML = arr_bk[i];
        })

        $('#backup_data input[name="'+ id +'"]').remove();
    }
    else if(arg2 == 'delete'){
        if (confirm("Press a button!")) {
            txt = "You pressed OK!";
        } else {
            txt = "You pressed Cancel!";
        }
    }
}

function upload(){
    $.post( "/inventory/module/upload" );
}
