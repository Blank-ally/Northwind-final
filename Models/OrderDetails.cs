using System.ComponentModel.DataAnnotations;
public class OrderDetails
{
   public int OrderDetailsId {get;set;}
   public int OrderId {get;set;}
   public int ProductId {get;set;}
   public decimal UnitPrice {get;set;}
   public short Quantity {get;set;}
   public decimal Discount {get;set;}
   public Order Order {get;set;}
   public Product Product {get;set;}



}