const libPictApplication = require('pict-application');
const libPictRouter = require('pict-router');
const libPictSectionModal = require('pict-section-modal');

// Views
const libViewLayout = require('./views/PictView-Bookstore-Layout.js');
const libViewTopBar = require('./views/PictView-Bookstore-TopBar.js');
const libViewBookList = require('./views/PictView-Bookstore-BookList.js');
const libViewAbout = require('./views/PictView-Bookstore-About.js');

class BookstoreApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		// Add the router provider with routes
		this.pict.addProvider('PictRouter', require('./providers/PictRouter-Bookstore-Configuration.json'), libPictRouter);

		// Add the layout view (the shell that contains top bar and content area)
		this.pict.addView('Bookstore-Layout', libViewLayout.default_configuration, libViewLayout);

		// Add the top bar navigation view
		this.pict.addView('Bookstore-TopBar', libViewTopBar.default_configuration, libViewTopBar);

		// Add the book list view
		this.pict.addView('Bookstore-BookList', libViewBookList.default_configuration, libViewBookList);

		// Add the about page view
		this.pict.addView('Bookstore-About', libViewAbout.default_configuration, libViewAbout);

		// Add the modal section view for confirm dialogs, modal windows, toasts, and tooltips
		this.pict.addView('PictSectionModal', libPictSectionModal.default_configuration, libPictSectionModal);
	}

	onAfterInitializeAsync(fCallback)
	{
		// Initialize application state with sample book data
		this.pict.AppData.Bookstore =
		{
			Books:
			[
				{ ID: 1, Title: "One Hundred Years of Solitude", Author: "Gabriel Garcia Marquez", Year: 1967, Genre: "Magical Realism", InStock: true },
				{ ID: 2, Title: "To Kill a Mockingbird", Author: "Harper Lee", Year: 1960, Genre: "Southern Gothic", InStock: true },
				{ ID: 3, Title: "Dune", Author: "Frank Herbert", Year: 1965, Genre: "Science Fiction", InStock: false },
				{ ID: 4, Title: "The Left Hand of Darkness", Author: "Ursula K. Le Guin", Year: 1969, Genre: "Science Fiction", InStock: true },
				{ ID: 5, Title: "Beloved", Author: "Toni Morrison", Year: 1987, Genre: "Historical Fiction", InStock: true },
				{ ID: 6, Title: "Blood Meridian", Author: "Cormac McCarthy", Year: 1985, Genre: "Western", InStock: false },
				{ ID: 7, Title: "The Master and Margarita", Author: "Mikhail Bulgakov", Year: 1967, Genre: "Satire", InStock: true },
				{ ID: 8, Title: "Invisible Cities", Author: "Italo Calvino", Year: 1972, Genre: "Fantasy", InStock: true },
				{ ID: 9, Title: "Pedro Paramo", Author: "Juan Rulfo", Year: 1955, Genre: "Magical Realism", InStock: false },
				{ ID: 10, Title: "The Remains of the Day", Author: "Kazuo Ishiguro", Year: 1989, Genre: "Literary Fiction", InStock: true }
			],
			NextID: 11
		};

		// Render the layout shell
		this.pict.views['Bookstore-Layout'].render();

		return super.onAfterInitializeAsync(fCallback);
	}

	/**
	 * Navigate to a route using the pict-router.
	 *
	 * @param {string} pRoute - The route path to navigate to (e.g. '/Books')
	 */
	navigateTo(pRoute)
	{
		this.pict.providers.PictRouter.navigate(pRoute);
	}

	/**
	 * Render a specific content view into the main content area.
	 * Called by the router when a route is matched.
	 *
	 * @param {string} pViewIdentifier - The view identifier to render
	 */
	showView(pViewIdentifier)
	{
		if (pViewIdentifier in this.pict.views)
		{
			this.pict.views[pViewIdentifier].render();
		}
		else
		{
			this.pict.log.warn(`View [${pViewIdentifier}] not found; falling back to BookList.`);
			this.pict.views['Bookstore-BookList'].render();
		}
	}

	/**
	 * Show a modal dialog with details about a specific book.
	 *
	 * @param {number} pBookID - The ID of the book to display
	 */
	viewBookDetails(pBookID)
	{
		let tmpBook = this.pict.AppData.Bookstore.Books.find((pBook) => { return pBook.ID === pBookID; });

		if (!tmpBook)
		{
			this.pict.views.PictSectionModal.toast('Book not found.', { type: 'error' });
			return;
		}

		let tmpStockLabel = tmpBook.InStock ? '<span style="color:#16a34a;font-weight:600;">In Stock</span>' : '<span style="color:#dc2626;font-weight:600;">Out of Stock</span>';

		let tmpContent = '<table class="bookstore-detail-table">'
			+ '<tr><td class="bookstore-detail-label">Title</td><td>' + tmpBook.Title + '</td></tr>'
			+ '<tr><td class="bookstore-detail-label">Author</td><td>' + tmpBook.Author + '</td></tr>'
			+ '<tr><td class="bookstore-detail-label">Year</td><td>' + tmpBook.Year + '</td></tr>'
			+ '<tr><td class="bookstore-detail-label">Genre</td><td>' + tmpBook.Genre + '</td></tr>'
			+ '<tr><td class="bookstore-detail-label">Availability</td><td>' + tmpStockLabel + '</td></tr>'
			+ '</table>';

		this.pict.views.PictSectionModal.show(
			{
				title: tmpBook.Title,
				content: tmpContent,
				closeable: true,
				width: '480px',
				buttons:
				[
					{ Hash: 'close', Label: 'Close', Style: 'primary' }
				]
			});
	}

	/**
	 * Delete a single book after confirmation.
	 *
	 * @param {number} pBookID - The ID of the book to delete
	 */
	deleteBook(pBookID)
	{
		let tmpBook = this.pict.AppData.Bookstore.Books.find((pBook) => { return pBook.ID === pBookID; });

		if (!tmpBook)
		{
			this.pict.views.PictSectionModal.toast('Book not found.', { type: 'error' });
			return;
		}

		this.pict.views.PictSectionModal.confirm(
			'Are you sure you want to remove "' + tmpBook.Title + '" from the inventory?',
			{
				title: 'Delete Book',
				confirmLabel: 'Delete',
				cancelLabel: 'Keep',
				dangerous: true
			}
		).then(
			(pConfirmed) =>
			{
				if (pConfirmed)
				{
					this.pict.AppData.Bookstore.Books = this.pict.AppData.Bookstore.Books.filter(
						(pEntry) => { return pEntry.ID !== pBookID; }
					);

					this.pict.views.PictSectionModal.toast('"' + tmpBook.Title + '" has been removed.', { type: 'success' });

					// Refresh the book list if it is currently rendered
					if (this.pict.views['Bookstore-BookList'])
					{
						this.pict.views['Bookstore-BookList'].refreshList();
					}
				}
			});
	}

	/**
	 * Delete all books with a double-confirmation requiring the user to type DELETE ALL.
	 */
	deleteAllBooks()
	{
		let tmpBookCount = this.pict.AppData.Bookstore.Books.length;

		if (tmpBookCount === 0)
		{
			this.pict.views.PictSectionModal.toast('The inventory is already empty.', { type: 'warning' });
			return;
		}

		this.pict.views.PictSectionModal.doubleConfirm(
			'This will permanently remove all ' + tmpBookCount + ' books from the inventory. This action cannot be undone.',
			{
				title: 'Clear All Books',
				confirmPhrase: 'DELETE ALL',
				phrasePrompt: 'Type "{phrase}" to confirm:',
				confirmLabel: 'Delete All',
				cancelLabel: 'Cancel'
			}
		).then(
			(pConfirmed) =>
			{
				if (pConfirmed)
				{
					this.pict.AppData.Bookstore.Books = [];

					this.pict.views.PictSectionModal.toast('All books have been removed from the inventory.', { type: 'success' });

					if (this.pict.views['Bookstore-BookList'])
					{
						this.pict.views['Bookstore-BookList'].refreshList();
					}
				}
			});
	}
}

module.exports = BookstoreApplication;

module.exports.default_configuration = require('./Pict-Application-Bookstore-Configuration.json');
