import { Router } from 'express'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'
import { AccountRepository } from './account.repository'
import { authenticate } from '../../shared/middlewares/auth'

const accountRepository = new AccountRepository()
const accountService = new AccountService(accountRepository)
const accountController = new AccountController(accountService)

const router = Router()

/**
 * @swagger
 * /api/accounts/accounts:
 *   post:
 *     summary: Create a new account
 *     tags:
 *       - Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAccountDTO'
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountResponseDTO'
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Internal server error
 */
router.post('/accounts', (req, res) => accountController.createAccountController(req, res))

/**
 * @swagger
 * /api/accounts/accounts/login:
 *   post:
 *     summary: Authenticate an account
 *     tags:
 *       - Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponseDTO'
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post('/accounts/login', (req, res) => accountController.loginAccountController(req, res))

/**
 * @swagger
 * /api/accounts/accounts:
 *   get:
 *     summary: List all accounts
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Accounts listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AccountResponseDTO'
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Conflict error
 *       500:
 *         description: Internal server error
 */
router.get('/accounts', authenticate, (req, res) =>
  accountController.listAccountsController(req, res),
)

/**
 * @swagger
 * /api/accounts/accounts/{id}:
 *   get:
 *     summary: Get an account by ID
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountResponseDTO'
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */
router.get('/accounts/:id', authenticate, (req, res) =>
  accountController.listAccountByIdController(req, res),
)

/**
 * @swagger
 * /api/accounts/accounts/email/{email}:
 *   get:
 *     summary: Get an account by email
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Account email
 *     responses:
 *       200:
 *         description: Account retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountResponseDTO'
 *       404:
 *         description: Account not found
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
router.get('/accounts/email/:email', authenticate, (req, res) =>
  accountController.listAccountByEmailController(req, res),
)

/**
 * @swagger
 * /api/accounts/accounts/{id}:
 *   put:
 *     summary: Update an account by ID
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAccountDTO'
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountResponseDTO'
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Account not found
 *       500:
 *         description: Internal server error
 */
router.put('/accounts/:id', authenticate, (req, res) =>
  accountController.updateAccountController(req, res),
)

/**
 * @swagger
 * /api/accounts/accounts/{id}:
 *   delete:
 *     summary: Delete an account by ID
 *     tags:
 *       - Accounts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Account ID
 *     responses:
 *       204:
 *         description: Account deleted successfully
 *       404:
 *         description: Account not found
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Internal server error
 */
router.delete('/accounts/:id', authenticate, (req, res) =>
  accountController.deleteAccountController(req, res),
)

export { router as accountRouter }
