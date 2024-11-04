import express from 'express';
import authRoutesAdmin from './routes/authRoutesAdmin';
import authRoutesUsers from "./routes/authRoutesUsers";
import userRoutes from "./routes/userRoutes";
import adminRoutes from './routes/adminRoutes';
import productRoutes from './routes/productsRoutes';
import { validateUser } from './middlewares/validateUser';
import { verifyAdmin } from './middlewares/verifyAdmin';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

//-----------------ADMIN ROUTES-----------------
app.use('/api/v1/auth/admin', authRoutesAdmin);
// app.use('/api/v1/admin',adminRoutes);
app.use('/api/v1/admin',verifyAdmin,adminRoutes);
//-----------------ADMIN ROUTES-----------------

//-----------------USER ROUTES-----------------
app.use('/api/v1/auth/user', authRoutesUsers);
app.use('/api/v1/user',validateUser ,userRoutes);
//-----------------USER ROUTES-----------------

app.use('/api/v1',productRoutes);
app.use('/public', express.static('public'));


export default app;