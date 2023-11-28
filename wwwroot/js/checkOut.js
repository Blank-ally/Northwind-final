$(function(){
    $('#sameAsShipChx').on('change', function () {
        let fields = ['firstname', 'lastname', 'address', 'address2', 'email', 'city', 'state', 'zip'];
      
        if (this.checked) {
            fields.forEach(function (field, i) {
                $('#billing-' + field).val($('#shipping-' + field).val()).attr('readonly', 'readonly');
            });
        } else {
            fields.forEach(function (field, i) {
                $('#billing-' + field).val('').removeAttr('readonly');
            });
        }
    })


  let addedDiscountCodes = [];

  getDiscounts()
  
  function getDiscounts() {
    var discounts = [];
    $.getJSON({
      url: `../../api/discount/`,
      success: function (response, textStatus, jqXhr) {
          for (var i = 0; i < response.length; i++){
            discounts.add(response[i]);
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // log the error to the console
        console.log("The following error occured: " + textStatus, errorThrown);
      }
    }); 

    console.log(discounts)

    return discounts;
}
})