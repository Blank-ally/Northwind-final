$(function () {
  getProducts();
  function getProducts() {
    var discontinued = $("#Discontinued").prop("checked")
      ? ""
      : "/discontinued/false";
    $.getJSON({
      url:
        `../../api/category/${$("#product_rows").data("id")}/product` +
        discontinued,
      success: function (response, textStatus, jqXhr) {
        $("#product_rows").html("");
        for (var i = 0; i < response.length; i++) {
          var css = response[i].discontinued ? " class='discontinued'" : "";
          var row = `<tr${css} data-id="${response[i].productId}" data-name="${
            response[i].productName
          }" data-price="${response[i].unitPrice}">
              <td>${response[i].productName}</td>
              <td class="text-right">${response[i].unitPrice.toFixed(2)}</td>
              <td class="text-right">${response[i].unitsInStock}</td>
            </tr>`;
          $("#product_rows").append(row);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // log the error to the console
        console.log("The following error occured: " + textStatus, errorThrown);
      },
    });
  }
  $("#CategoryId").on("change", function () {
    $("#product_rows").data("id", $(this).val());
    getProducts();
  });
  $("#Discontinued").on("change", function () {
    getProducts();
  });
  // delegated event listener
  $("#product_rows").on("click", "tr", function () {
    // make sure a customer is logged in
    if (
      $("#User").data("customer").toLowerCase() == "true" &&
      $("tr").hasClass("discontinued") == false
    ) {
      $("#ProductId").html($(this).data("id"));
      $("#ProductName").html($(this).data("name"));
      $("#UnitPrice").html($(this).data("price").toFixed(2));
      // calculate and display total in modal
      $("#Quantity").change();
      $("#cartModal").modal();
    } else {
      if ($("tr").hasClass("discontinued") == true) {
        toast(
          "Discountinued",
          "this product is discountinued it is no longer available for purchase"
        );
      } else {
        toast(
          "Access Denied",
          "You must be signed in as a customer to access the cart."
        );
      }
    }
  });

  $("#addToCart").on("click", function () {
    $("#cartModal").modal("hide");
    $.ajax({
      headers: { "Content-Type": "application/json" },
      url: "../../api/addtocart",
      type: "post",
      data: JSON.stringify({
        id: Number($("#ProductId").html()),
        email: $("#User").data("email"),
        qty: Number($("#Quantity").val()),
      }),
      success: function (response, textStatus, jqXhr) {
        // success
        toast(
          "Product Added",
          `${response.product.productName} successfully added to cart.`,
          getProducts()
        );
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // log the error to the console
        console.log(
          "The following error occured: " + jqXHR.status,
          errorThrown
        );
        toast("Error", "Please try again later.");
      },
    });
  });
  function toast(header, message) {
    $("#toast_header").html(header);
    $("#toast_body").html(message);
    var $toast = $("#cart_toast").toast({ delay: 2500 });
    $toast.toast("show");
  }

  $(".updcrt").on("click", function () {
    // make sure a customer is logged in
    if ($("#User").data("customer").toLowerCase() == "true") {
      $("#ProductId").html($(this).data("id"));
      $("#ProductName").html($(this).data("name"));
      $("#UnitPrice").html(parseInt($(this).data("price")).toFixed(2));

      var cartItemId = $(this).data("cartItemId");
      $("#update").attr("asp-route-id", cartItemId);

      /// rework
      $("#Quantity").change();
      $("#cartModal").modal();
    } else {
      toast(
        "Access Denied",
        "You must be signed in as a customer to access the cart."
      );
    }
  });

  // update total when cart quantity is changed
  $("#Quantity").change(function () {
    var total = parseInt($(this).val()) * parseFloat($("#UnitPrice").html());
    $("#Total").html(numberWithCommas(total.toFixed(2)));
  });
  // function to display commas in number
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  $(".equipCatValidation").on("keydown keyup change", function (e) {
    if (
      $(this).val() > 100 &&
      e.keyCode !== 46 && // keycode for delete
      e.keyCode !== 8 // keycode for backspace
    ) {
      e.preventDefault();
      $(this).val(100);
    }
  });

  $("#update").on("click", function (e) {
    e.preventDefault();
    $("#cartModal").modal("hide");

    $.ajax({
      headers: { "Content-Type": "application/json" },
      url: "../../api/UpdateCartItem",
      type: "PUT",
      data: JSON.stringify({
        id: Number($("#ProductId").html()),
        email: $("#User").data("email"),
        qty: Number($("#Quantity").val()),
      }),
      success: function (response, textStatus, jqXhr) {
        if (response && response.product) {
          console.log("AJAX Success");
        } else {
          console.log("No product details returned in AJAX response.");
        }
      },

      error: function (jqXHR, textStatus, errorThrown) {
        // log the error to the console
        console.log("AJAX Error");
        console.log(
          "The following error occured: " + jqXHR.status,
          errorThrown
        );
        toast("Error", "Please try again later.");
      },

      // Add 'complete' here
      complete: function () {
        var updatedQuantity = Number($("#Quantity").val());
        var unitPrice = parseFloat($("#UnitPrice").html());
        var cartItemId = parseInt($("#ProductId").html());
        var $itemRow = $(`tr[data-id="${cartItemId}"]`);

        if ($itemRow.length) {
          // If Item exists in table
          $itemRow.find(".quantityColumn").text(updatedQuantity);
          $itemRow
            .find(".totalColumn")
            .text((updatedQuantity * unitPrice).toFixed(2));
        }

        toast("Product Updated", `Product quantity is successfully updated.`),
          getProducts(),
          location.reload();
      },
    });
  });
});
