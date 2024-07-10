const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


const registerUserController = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(422).json({
      errors: [
        { field: 'firstName', message: 'First name is required' },
        { field: 'lastName', message: 'Last name is required' },
        { field: 'email', message: 'Email is required' },
        { field: 'password', message: 'Password is required' },
      ],
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
      },
    });
    // console.log(user);
    const organisation = await prisma.organisation.create({
      data: {
       
        name: `${user.firstName}'s Organisation`,
        description:''
        
      },
    });
    // console.log(organisation);
    const organizationOnUsers= await prisma.organisationsOnUsers.create({
      data: {
        userId:user.userId,
        organisationId:organisation.orgId
      }
    })
    // console.log(organizationOnUsers);
    

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user:{
          userId:user.userId,
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        phone:user.phone
        }  
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400,
      // error:error
    });
  }
};


const loginUserController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      errors: [
        { field: 'email', message: 'Email is required' },
        { field: 'password', message: 'Password is required' },
      ],
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user:{
          userId:user.userId,
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        phone:user.phone
        }
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 400,
    });
  }
};

const checkUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { userId: id },
    });
    // console.log(user.userId)

    if (!user) {
      return res.status(404).json({
        status: 'Not Found',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User retrieved successfully',
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to retrieve user',
    });
  }
};

module.exports = {
                 registerUserController,
                loginUserController,
                  checkUser};
