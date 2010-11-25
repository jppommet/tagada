/* 
TODO 
- make the plugin compliant with jQuery UI
- handle unicode characters 
- autocomplete with word suggestions
- option to limit the number of tags
*/
(function($) {
    $.fn.tagada = function (options) {
        // default options
        //var defaults = {};
        //if (options) $.extend(defaults, options);
        return this.each(function (index, elt) {
            // create a new input hidden tags
            var
 			$tag_list = 'list-' + index,
			$tags = $("<input/>", {
				'name'	: elt.name + '_val',
                'id'	: elt.id + '-val',
                'type'	: 'hidden',
				//'class'	: 'tagada-val'
            });
			
            $tags.data($tag_list, []).insertAfter($(this).wrap('<div class="tagada-wrapper" />'));
            // user typing
            $(this).keydown(function (event) {
				console.log('>> which: ', event.which, ' >> keyCode: ', event.keyCode, '>> charCode: ', event.charCode);
				
                // key enter, tab and comma pressed
                if ($(this).val() != '' && (event.keyCode == '13' || event.keyCode == '9' || event.keyCode == '188')) {
                    event.preventDefault();
                    // remove whitespace characters and match alpha numeric strings
                    var $tag = $.trim($(this).val());
                    var $tag_matches = $tag.match(/[a-zA-Z0-9]+/g);

                    // input tag value is not an alphanumeric string
                    if (null === $tag_matches) 
					{ 
	                    $(this).val('');
						return;
					}
                    $tag = $tag_matches.join(' ');

                    // reset input tag if the tag already exists already
                    if ($.inArray($tag, $tags.data($tag_list)) != - 1) {
                        $(this).val('');
                        return;
                    }

                    // add the new tag
                    $("<span/>", {
                        'class': 'tagada-tag',
                        'text': $tag
                    })
					.bind('delete', function () {
						var i = $(this).index();
						// not found
                        if (i == - 1) 
						{ 
							return; 
						}
						$(this).remove();
						
						// update tags
						$tags.val(function (index, value) {							
							var data_list = $(this).data($tag_list);
							// remove value from tag list
							data_list.splice(i, 1);	
							return data_list.join(',');
						});
                    })
					.append($("<a/>", {
                        'class': 'tagada-tag-close',
                        'text': 'x',
                        'click': function () {
                            $(this).parent().trigger('delete');
                        }
                    })).insertBefore($(this));

					// update tags
					$tags.val(function (index, value) {
						var data_list = $(this).data($tag_list);
						// add a new value to tag list
						data_list.push($tag);
						return data_list.join(',');
					});
					
                    // reset input tag value
                    $(this).val('');
                }
            });
        });
    };
})(jQuery);
