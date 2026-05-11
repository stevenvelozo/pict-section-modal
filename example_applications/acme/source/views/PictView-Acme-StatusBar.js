/**
 * Acme-StatusBar — status text in the bottom bar.
 *
 * Renders into `#Theme-BottomBar-Status` (the slot that pict-section-
 * theme's Theme-BottomBar exposes). The text shown is
 * `AppData.Acme.Status` which the application updates on each route
 * change (and could update from any other state change too — async
 * loads, save indicators, etc.).
 *
 * Mounted automatically because the application bootstrap passes
 *
 *     ViewOptions: { BottomBar: { StatusView: 'Acme-StatusBar' } }
 *
 * to the Theme-Section provider.
 */

const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:               'Acme-StatusBar',
	DefaultRenderable:            'Acme-StatusBar-Content',
	DefaultDestinationAddress:    '#Theme-BottomBar-Status',
	DefaultTemplateRecordAddress: 'AppData.Acme',
	AutoRender:                   false,

	Templates:
	[
		{
			Hash: 'Acme-StatusBar-Template',
			Template: /*html*/`<span class="acme-status-message">{~D:Record.Status~}</span>`
		}
	],

	Renderables:
	[
		{
			RenderableHash:     'Acme-StatusBar-Content',
			TemplateHash:       'Acme-StatusBar-Template',
			DestinationAddress: '#Theme-BottomBar-Status',
			RenderMethod:       'replace'
		}
	]
};

class AcmeStatusBarView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onBeforeRender() { return this.pict.AppData.Acme; }
}

module.exports = AcmeStatusBarView;
module.exports.default_configuration = _ViewConfiguration;
