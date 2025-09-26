import { body, param, validationResult } from 'express-validator';
import User from '../models/User.js';

export const createUserValidators = [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('role').optional().isIn(['user', 'admin']),
  body('password').isString().isLength({ min: 6 }),
];

export async function createUser(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, role, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, role: role || 'user', passwordHash });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const { q } = req.query;
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
          ],
        }
      : {};
    const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export const getUserValidators = [param('id').isMongoId()];
export async function getUser(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { id } = req.params;
    const user = await User.findById(id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export const updateUserValidators = [
  param('id').isMongoId(),
  body('name').optional().isString().isLength({ min: 2 }),
  body('email').optional().isEmail(),
  body('role').optional().isIn(['user', 'admin']),
  body('password').optional().isString().isLength({ min: 6 }),
];

export async function updateUser(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (role) update.role = role;
    if (password) update.passwordHash = await User.hashPassword(password);
    const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export const deleteUserValidators = [param('id').isMongoId()];
export async function deleteUser(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}


