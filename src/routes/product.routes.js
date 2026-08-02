import { Router } from 'express';
import authMiddleware, { optionalAuthMiddleware } from '../middlewares/auth.middleware.js';
import { createProduct, allProducts , getSingleProduct , deleteProduct , updateProduct} from '../controllers/product.controllers.js';
import { upload } from '../middlewares/multer.middleware.js';
const productRouter = Router();


// Admin & User & Guests
productRouter.get('/all', optionalAuthMiddleware, allProducts);

productRouter.get('/get-single/:id', optionalAuthMiddleware, getSingleProduct);



// Admin Only
productRouter.post('/create', authMiddleware, upload.single("image"), createProduct);

productRouter.patch('/update/:id', authMiddleware, upload.single("image"), updateProduct);

productRouter.delete('/delete/:id', authMiddleware, deleteProduct);



export default productRouter;