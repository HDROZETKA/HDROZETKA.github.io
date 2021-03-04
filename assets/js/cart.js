document.addEventListener('DOMContentLoaded', () => {
	
	const productsBtn = document.querySelectorAll('.product-btn');
	const cart = document.querySelector('.cart');
	const orderQuantity = document.querySelector('.order-quantity');
	const orderQuantityModal = document.querySelector('.order-quantity-modal');
	const fullPrice = document.querySelector('.fullprice');
	const orderProductsList = document.querySelector('.order-list');
	const orderModalOpenProd = document.querySelector('.order-modal-btn');
	let price = 0;
	let ids = [0,1,2,3,4,5,6,7,8,9,9];
	let productArray = [];
	
	const priceWithoutSpaces = (str) => {
		return str.replace(/\s/g, '');
	};

	const normalPrice = (str) => {
		return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
	};

	const plusFullPrice = (currentPrice) => {
		return price += currentPrice;
	};
	
	const minusFullPrice = (currentPrice) => {
		return price -= currentPrice / 2;
	};
	
	const printQuantity = () => {
		let productsListLength = orderProductsList.children.length;
		orderQuantity.textContent = productsListLength - 1 ;
		orderQuantityModal.textContent = `${productsListLength - 1} шт`;
	};

	const printFullPrice = () => {
		fullPrice.textContent = `${normalPrice(price)} ₴`;
	};
	
	let flag = 0;
	orderModalOpenProd.addEventListener('click', (e) => {
		if (flag == 0) {
			orderModalOpenProd.classList.add('open');
			orderProductsList.style.display = 'block';
			flag = 1;
		} else {
			orderModalOpenProd.classList.remove('open');
			orderProductsList.style.display = 'none';
			flag = 0;
		}
	});
	
	const generateOrderProduct = (img, title, price, id) => {
		return `
			<li class="order-product-item">
				<article class="order-product" data-id="${id}">
					<img src="${img}" alt="" class="order-product-img">
					<div class="order-product-text">
						<h3 class="order-product-title">${title}</h3>
						<span class="order-product-price">${normalPrice(price)}</span>
					</div>
					<button class="order-product-delete" aria-label="Удалить товар"></button>
				</article>
			</li>
		`;
	};
	
	const deleteProducts = (productParent) => {
		let id = productParent.querySelector('.order-product').dataset.id;
		if (document.querySelector('.product[data-id="${id}"]' != null)) {document.querySelector('.product[data-id="${id}"]').querySelector('.product-btn').disabled = false};
		
		let currentPrice = parseInt(priceWithoutSpaces(productParent.querySelector('.order-product-price').textContent));
		minusFullPrice(currentPrice);
		printFullPrice();
		productParent.remove();

		printQuantity();

		updateStorage();
	};
	
	orderProductsList.addEventListener('click', (e) => {
		if (e.target.classList.contains('order-product-delete')) {
			deleteProducts(e.target.closest('.order-product-item'));
		}
	});
	
	productsBtn.forEach(el => {
		el.addEventListener('click', (e) => {
			let self = e.currentTarget;
			let parent = self.closest('.product');
			let id = parent.dataset.id;
			let img = parent.querySelector('.product-image img').getAttribute('src');
			let title = parent.querySelector('.product-title a').textContent;
			let priceString = priceWithoutSpaces(parent.querySelector('.product-price').textContent);
			let priceNumber = parseInt(priceWithoutSpaces(parent.querySelector('.product-price').textContent));

			plusFullPrice(priceNumber);

			printFullPrice();

			orderProductsList.insertAdjacentHTML('afterbegin', generateOrderProduct(img, title, priceString, id));
			printQuantity();


			updateStorage();
			
			self.disabled = true;
		});
	});
	
	orderProductsList.addEventListener('click', (e) => {
		if (e.target.classList.contains('order-product-delete')) {
			deleteProducts(e.target.closest('.order-product-item'));
		}
	});
	
	const countSumm = () => {
		document.querySelectorAll('.order-product').forEach(el => {
			price += parseInt(priceWithoutSpaces(el.querySelector('.order-product-price').textContent));
		});
	};
	
	const updateStorage = () => {
		let parent = orderProductsList;
		let html = parent.innerHTML;
		html = html.trim();

		if (html.length) {
			localStorage.setItem('products', html);
		} else {
			localStorage.removeItem('products');
		}
	};
	
	const initialState = () => {
		if (localStorage.getItem('products') != null) {
			orderProductsList.innerHTML = localStorage.getItem('products');
			document.querySelectorAll('.order-product').forEach(el => {
				var id_1 = el.dataset.id;
				if (document.querySelector(`.product[data-id="${id_1}"]`) == null) {var id_2 = null} else {var id_2 = document.querySelector(`.product[data-id="${id_1}"]`).dataset.id};
				if (id_2 != null) {
					document.querySelector(`.product[data-id="${id_1}"]`).querySelector('.product-btn').disabled = true;
				};
			});
			printQuantity();
			countSumm();
			printFullPrice();
			updateStorage();
		}
	};

	initialState();
	
});