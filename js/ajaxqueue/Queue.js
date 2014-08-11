Queue = {
  get_url: 'queue_processor.php',

  loading_img: '<img src="images/ajax-loader.gif">',

  ajax_request: [],

  initQueue : function() {
    $("div#processing-table-container").hide();

    $("#btn-submit").button().click(function() {
      Queue.updateUUIDs(); 
    });

    $("#btn-submit-more").button().click(function() {
      Queue.resetMore();
    });
  },

  updateUUIDs : function() {
    $("div#processing-table-container").show();
    $(".form-group").hide();

    var uuid_array = Queue.validateUUIDs();
    var queue = $.map(uuid_array, function(element, index) { return index });

    Queue.processQueue(queue, 5, Queue.doAjaxBatch, Queue.doDone, uuid_array);

  },

  resetMore : function() {
     $("div#processing-table-container").hide();
     $(".form-group").show();
  },

  processQueue : function(queue, num, ajaxBatch, done, uuid_array) {
    var items = queue.splice(0, num),
        count = items.length;

    if (!count) {
        done && Queue.doDone(); 
        return;
    }

    for (var i = 0; i < count; i++) {
        ajaxBatch(items[i], function(cancel) {
            if (Queue.update_canceled == true) {
                queue = [];
                count = 1;
            } 
            --count || Queue.processQueue(queue, num, ajaxBatch, done, uuid_array);
        },
        uuid_array
        );
    }
  },

  showStatus : function(uuid, status_class) {
    var uuid_htmlid = '#' + uuid;
    $(uuid_htmlid).attr('class', status_class);

    switch (status_class) {
        case "update":

            $(uuid_htmlid).text("Updating");
            $(uuid_htmlid).last().append(Queue.loading_img);
            break;

        case "success":

            $(uuid_htmlid).text("Success");
            $(uuid_htmlid).find('img').remove();
            break;

        case "failure":

            $(uuid_htmlid).text("Failed");
            $(uuid_htmlid).find('img').remove();
            break;

        case "cancel":

            $(uuid_htmlid).text("Canceled");
            $(uuid_htmlid).find('img').remove();
            break;
    } 
  },

  /**
   * Validate UUIDs
   *
   **/
  validateUUIDs : function() {
    var lines = $("#uuids").val().split(/\n/);
    var uuid_array = [];

    for (var i = 0; i < lines.length; i++) {
     
      if (/\S/.test(lines[i])) {
        uuid_array.push(lines[i].replace(/\W/g, '')); //remove any non-alphanumerics
       
        //Put all submitted UUIDs in a "Pending" status
        var process_table_tr = 
          '<tr class="ajax-row">' +
          '<td>' + uuid_array[i] + '</td>' +
          '<td id="' + uuid_array[i].substring(1,6) + '" class="pending">Pending</td>' +
          '</tr>';

        $("#uuid-process-table").last().append(process_table_tr);
      }
    }
    return uuid_array;
  },

  doAjaxBatch : function(item, done, uuid_array) {
    Queue.showStatus(uuid_array[item].substring(1,6), 'update') 

    // add the counter

    $.ajax({
        url: Queue.get_url + '/' + uuid_array[item],
        
        beforeSend: function (jqXHR) {
            Queue.ajax_request.push(jqXHR)
        },
        dataType: 'json',
        
        success: function(success) {
            if (success) {
                Queue.showStatus(uuid_array[item].substring(1,6), 'success'); 
                done();
            } else {
                Queue.showStatus(uuid_array[item].substring(1,6), 'failure'); 
                done()
            }
        },

        error: function(jqXHR, textStatus) {
        }
    })
  },

  doDone : function() {
    //alert("calling from doDone");
  }
}
