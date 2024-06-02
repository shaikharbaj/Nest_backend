import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prismaservice';
import { Response } from 'express';
import * as puppeteer from 'puppeteer';
import { PaginateFunction, paginator } from '../prisma/paginator';
import { contains } from 'class-validator';
const paginate: PaginateFunction = paginator({ perPage: 10 });
@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
  async findManywithPagination(select: {}, where: any, page: number = 1) {
    console.log(select);
    console.log(where);
    console.log(page);
    return await paginate(
      this.prisma.orderItem,
      {
        select: select,
        where: { ...where },
      },
      { page },
    );
  }
  async orderproduct(auth: any, data: any, res: Response) {
    try {
      //check the stock of products....
      for (let item of data?.orderItems) {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new BadRequestException(`Product not found: ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product: ${product.name}`,
          );
        }
      }
      const order = await this.prisma.$transaction(async (prisma) => {
        const createdOrder = await prisma.order.create({
          data: {
            userId: auth.userId,
            totalPrice: data.totalPrice,
            status: data?.status,
            paymentStatus: data?.paymentStatus,
            paymentMethod: data?.paymentMethod,
            shippingName: data.shippingDetails.name,
            shippingEmail: data.shippingDetails.email,
            shippingCountry: data.shippingDetails.country,
            shippingState: data.shippingDetails.state,
            shippingCity: data.shippingDetails.city,
            shippingAddressLine1: data.shippingDetails.addressLine1,
            shippingPhone: data.shippingDetails.phone,
            shippingZipCode: data.shippingDetails.zipCode,
            orderItems: {
              create: data?.orderItems,
            },
          },
        });

        for (let item of data?.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        return createdOrder;
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Order place Successfully',
        data: order,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message, success: false });
    }
  }

  async getallordersofcustomer(auth: any, res: Response) {
    try {
      const orders = await this.prisma.order.findMany({
        select: {
          id: true,
          userId: true,
          totalPrice: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          shippingName: true,
          shippingPhone: true,
          shippingEmail: true,
          shippingAddressLine1: true,
          shippingAddressLine2: true,
          shippingCity: true,
          shippingState: true,
          shippingZipCode: true,
          shippingCountry: true,
          createdAt: true,
          orderItems: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: true,
              status: true,
              paymentStatus: true,
            },
          },
        },
        where: {
          userId: Number(auth.userId),
        },
      });
      if (!orders) {
        throw new Error('no order found');
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'order fetch successfully',
        data: orders,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  }

  async getorderbyID(auth: any, id: number, res: Response) {
    try {
      const order = await this.prisma.order.findFirst({
        select: {
          id: true,
          userId: true,
          totalPrice: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          shippingName: true,
          shippingPhone: true,
          shippingEmail: true,
          shippingAddressLine1: true,
          shippingAddressLine2: true,
          shippingCity: true,
          shippingState: true,
          shippingZipCode: true,
          shippingCountry: true,
          createdAt: true,
          orderItems: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: {
                include: {
                  productImages: true,
                },
              },
              status: true,
              paymentStatus: true,
            },
          },
        },
        where: {
          AND: [{ id: Number(id) }, { userId: Number(auth.userId) }],
        },
      });

      return res.status(201).json({
        data: order,
        success: true,
        message: 'order fetch successfully',
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message, success: false });
    }
  }

  async loadallsupplierorders(
    auth: any,
    page: number,
    searchTerm: string,
    res: Response,
  ) {
    try {
      // console.log(auth);
      //check order is present or not.....
      //   const order = await this.prisma.order.findFirst({
      //     select: {
      //       id: true,
      //       userId: true,
      //       totalPrice: true,
      //       status: true,
      //       paymentStatus: true,
      //       paymentMethod: true,
      //       shippingName: true,
      //       shippingPhone: true,
      //       shippingEmail: true,
      //       shippingAddressLine1: true,
      //       shippingAddressLine2: true,
      //       shippingCity: true,
      //       shippingState: true,
      //       shippingZipCode: true,
      //       shippingCountry: true,
      //       createdAt: true,
      //       orderItems: {
      //         select: {
      //           id: true,
      //           quantity: true,
      //           price: true,
      //           product: true,
      //           status: true,
      //           paymentStatus: true,
      //         },
      //       },
      //     },
      //     where: {
      //       userId: Number(auth.userId),
      //     },
      //   });
      //   OR: [
      //     { name: { contains: searchTerm, mode: 'insensitive' } },
      //     {category:{
      //          OR:[{name:{contains: searchTerm, mode: 'insensitive' }}]
      //     }},
      //     {subcategory:{
      //       OR:[{name:{contains: searchTerm, mode: 'insensitive' }}]
      //  }}
      const orderstatus = [
        'PENDING',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELED',
      ];
      const paymentStatus = orderstatus.includes(searchTerm.toUpperCase())
        ? searchTerm.toUpperCase()
        : null;
      const where: any = {
        supplierId: Number(auth?.userId), // Filter by supplier ID being 4
        OR: [
          { product: { name: { contains: searchTerm, mode: 'insensitive' } } },
          {
            order: {
              user: { name: { contains: searchTerm, mode: 'insensitive' } },
            },
          },
        ],
      };
      const select: any = {
        id: true,
        order: {
          include: {
            user: true,
          },
        },
        orderId: true,
        product: true,
        productId: true,
        quantity: true,
        supplierId: true,
        supplier: true,
        status: true,
        paymentStatus: true,
        price: true,
      };
      const data = await this.findManywithPagination(select, where, page);
      // console.log(data);
      // const orders = await this.prisma.orderItem.findMany({
      //   where: {
      //     supplierId: Number(auth?.userId),
      //   },
      //   include: {
      //     order: {
      //          include:{
      //             user:true
      //          }
      //     },
      //     product: true,
      //   },
      // });

      return res.status(201).json({
        data,
        success: true,
        message: 'supplier order fetch successfully...!',
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message, success: false });
    }
  }

  async loadsinglesupplierOrder(auth: any, id: number, res: Response) {
    try {
      const order = await this.prisma.orderItem.findFirst({
        where: {
          AND: [{ supplierId: Number(auth?.userId) }, { id: Number(id) }],
        },
        include: {
          order: {
            include: {
              user: true,
            },
          },
          product: true,
        },
      });
      return res.status(201).json({
        data: order,
        success: true,
        message: 'supplier order fetch successfully...!',
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message, success: false });
    }
  }

  async updateorderstatus(auth: any, data: any, res: Response) {
    try {
      const updateorder = await this.prisma.orderItem.update({
        include: {
          order: {
            include: {
              user: true,
            },
          },
          product: true,
        },
        where: {
          id: Number(data?.orderItemId),
        },
        data: {
          status: data?.status,
          paymentStatus: data?.paymentStatus,
        },
      });

      //check orderitems are delivered or not if delivered then change the status of order from pending to delivered...........
      if (updateorder.order.paymentMethod === 'CASH_ON_DELIVERY') {
        //find all order of that particular orderid
        const orders = await this.prisma.order.findFirst({
          include: {
            orderItems: true,
          },
          where: {
            id: Number(updateorder.order.id),
          },
        });
        let flag: boolean = true;
        for (let item in orders['orderItems']) {
          if (orders['orderItems'][item].status !== 'DELIVERED') {
            flag = false;
            break;
          }
        }
        if (flag) {
          //change the status of the delivered and payment status to paid....
          const changeorderstatus = await this.prisma.order.update({
            where: {
              id: Number(updateorder.order.id),
            },
            data: {
              status: 'DELIVERED',
              paymentStatus: 'PAID',
            },
          });
        }
      }

      //and change orderstatus from unpaid to paid in case of cash on delivery.....

      return res.status(201).json({
        data: updateorder,
        success: true,
        message: 'status updated successfully...!',
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message, success: false });
    }
  }

  async generate_invoice(id: any, res: Response) {
    try {
      const order = await this.prisma.order.findFirst({
        select: {
          id: true,
          userId: true,
          totalPrice: true,
          status: true,
          paymentStatus: true,
          paymentMethod: true,
          shippingName: true,
          shippingPhone: true,
          shippingEmail: true,
          shippingAddressLine1: true,
          shippingAddressLine2: true,
          shippingCity: true,
          shippingState: true,
          shippingZipCode: true,
          shippingCountry: true,
          createdAt: true,
          orderItems: {
            select: {
              id: true,
              quantity: true,
              price: true,
              product: {
                include: {
                  productImages: true,
                },
              },
              status: true,
              paymentStatus: true,
            },
          },
        },
        where: {
          AND: [{ id: Number(id) }],
        },
      });
      let htmlcontent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Invoice</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f6f6f6;
              }
              .invoice-container {
                  width: 80%;
                  margin: auto;
                  background-color: #ffffff;
                  padding: 20px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .invoice-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding-bottom: 20px;
                  border-bottom: 2px solid #eeeeee;
              }
              .invoice-header img {
                  height: 50px;
              }
              .invoice-header h2 {
                  margin: 0;
                  font-size: 24px;
                  color: #333333;
              }
              .invoice-body {
                  padding: 20px 0;
              }
              .invoice-address {
                  margin-bottom: 20px;
              }
              .invoice-address h3 {
                  margin-bottom: 10px;
              }
              .invoice-details,
              .invoice-summary {
                  width: 100%;
                  margin-bottom: 20px;
              }
              .invoice-details table,
              .invoice-summary table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .invoice-details th, .invoice-details td,
              .invoice-summary th, .invoice-summary td {
                  padding: 10px;
                  border: 1px solid #eeeeee;
              }
              .invoice-details th, .invoice-summary th {
                  background-color: #f9f9f9;
                  text-align: left;
              }
              .invoice-details td,
              .invoice-summary td {
                  text-align: right;
              }
              .invoice-footer {
                  text-align: center;
                  padding: 20px;
                  border-top: 2px solid #eeeeee;
              }
          </style>
      </head>
      <body>
          <div class="invoice-container">
              <div class="invoice-header">
                  <div>
                      <h2>Invoice</h2>
                      <p><strong>Order ID:</strong> ${order.id}</p>
                      <p><strong>Date:</strong> ${order.createdAt}</p>
                  </div>
                  <div>
                      <img src="your-logo-url.png" alt="Company Logo">
                  </div>
              </div>
              <div class="invoice-body">
                  <div class="invoice-address">
                      <h3>Shipping Address</h3>
                      <p>${order.shippingName}</p>
                      <p>${order.shippingPhone}</p>
                      <p>${order.shippingEmail}</p>
                      <p>${order.shippingAddressLine1}</p>
                      <p>${order.shippingCity}, ${order.shippingState} ${order.shippingZipCode}</p>
                      <p>${order.shippingCountry}</p>
                  </div>
                  <div class="invoice-details">
                      <h3>Order Details</h3>
                      <table>
                          <thead>
                              <tr>
                                  <th>Product</th>
                                  <th>Image</th>
                                  <th>Quantity</th>
                                  <th>Unit Price</th>
                                  <th>Total</th>
                                  <th>Status</th>
                                  <th>Payment Status</th>
                              </tr>
                          </thead>
                          <tbody>
                              ${order.orderItems
                                .map(
                                  (item) => `
                              <tr>
                                  <td style="text-align: left;">${item.product.name}</td>
                                  <td><img src="${item.product.productImages[0]?.url || 'placeholder.jpg'}" alt="${item.product.name}" style="height: 50px;"></td>
                                  <td>${item.quantity}</td>
                                  <td>$${item.price.toFixed(2)}</td>
                                  <td>$${(item.quantity * item.price).toFixed(2)}</td>
                                  <td>${item.status}</td>
                                  <td>${item.paymentStatus}</td>
                              </tr>
                              `,
                                )
                                .join('')}
                          </tbody>
                      </table>
                  </div>
                  <div class="invoice-summary">
                      <h3>Summary</h3>
                      <table>
                          <tr>
                              <th>Subtotal</th>
                              <td>$${order.orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}</td>
                          </tr>
                          <tr>
                              <th>Total</th>
                              <td>$${order.totalPrice.toFixed(2)}</td>
                          </tr>
                      </table>
                  </div>
              </div>
              <div class="invoice-footer">
                  <p>Thank you for your business!</p>
              </div>
          </div>
      </body>
      </html>`;
      
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        timeout: 60000,
      });
      const page = await browser.newPage();
      await page.setContent(htmlcontent, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4', printBackground: true });
      await browser.close();
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdf.length,
      });
      return res.status(HttpStatus.OK).send(pdf);
    } catch (error) {
      console.log(error);
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message, success: false });
    }
  }
}
