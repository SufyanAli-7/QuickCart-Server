import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { createProduct, allProducts , getSingleProduct} from '../controllers/product.controllers.js';
import { upload } from '../middlewares/multer.middleware.js';
const productRouter = Router();


productRouter.post('/create', authMiddleware, upload.single("image"), createProduct);

productRouter.get('/all', authMiddleware, allProducts);

productRouter.get('/get-single/:id', authMiddleware, getSingleProduct);

// productRouter.patch('/update/:id', authMiddleware, upload.single("image"), updateProduct);
// productRouter.delete('/delete/:id', authMiddleware, deleteProduct);

// productRouter.get('/public-all', publicAllProducts);


export default productRouter;