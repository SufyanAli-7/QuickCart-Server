import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { createProduct, allProducts , getSingleProduct , deleteProduct , updateProduct} from '../controllers/product.controllers.js';
import { upload } from '../middlewares/multer.middleware.js';
const productRouter = Router();


// Admin & User Both
productRouter.get('/all', authMiddleware, allProducts);

productRouter.get('/get-single/:id', authMiddleware, getSingleProduct);



// Admin Only
productRouter.post('/create', authMiddleware, upload.single("image"), createProduct);

productRouter.patch('/update/:id', authMiddleware, upload.single("image"), updateProduct);

productRouter.delete('/delete/:id', authMiddleware, deleteProduct);



export default productRouter;