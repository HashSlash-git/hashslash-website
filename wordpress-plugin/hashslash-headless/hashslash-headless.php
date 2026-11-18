<?php
/**
 * Plugin Name:       HashSlash Headless
 * Description:       Services, Industries and Case Studies for the HashSlash Astro front end, plus an automatic site rebuild on publish and basic hardening.
 * Version:           1.0.1
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Author:            HashSlash
 * License:           GPL-2.0-or-later
 * Text Domain:       hashslash-headless
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class HS_Headless {

	const OPT        = 'hs_headless';
	const NONCE      = 'hs_headless_meta';
	const CRON_HOOK  = 'hs_headless_rebuild';
	const TYPES      = array( 'hs_service', 'hs_industry', 'hs_case_study' );

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register_types' ) );
		add_action( 'init', array( __CLASS__, 'register_meta' ) );
		add_action( 'add_meta_boxes', array( __CLASS__, 'meta_boxes' ) );
		add_action( 'save_post', array( __CLASS__, 'save_meta' ), 10, 2 );

		// Rebuild the static site when content changes.
		add_action( 'transition_post_status', array( __CLASS__, 'queue_rebuild' ), 10, 3 );
		add_action( 'before_delete_post', array( __CLASS__, 'queue_rebuild_on_delete' ) );
		add_action( self::CRON_HOOK, array( __CLASS__, 'do_rebuild' ) );

		// Settings, import and manual rebuild.
		add_action( 'admin_menu', array( __CLASS__, 'settings_page' ) );
		add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
		add_action( 'admin_post_hs_import', array( __CLASS__, 'import_seed' ) );
		add_action( 'admin_post_hs_rebuild', array( __CLASS__, 'manual_rebuild' ) );
		add_action( 'admin_notices', array( __CLASS__, 'notices' ) );

		// Headless: send visitors of the old theme to the new front end.
		add_action( 'template_redirect', array( __CLASS__, 'redirect_frontend' ) );

		// Hardening (the previous site was compromised).
		add_filter( 'xmlrpc_enabled', '__return_false' );
		add_filter( 'rest_endpoints', array( __CLASS__, 'hide_user_endpoints' ) );
		add_filter( 'rest_prepare_hs_case_study', array( __CLASS__, 'guard_unapproved' ), 10, 2 );
		remove_action( 'wp_head', 'wp_generator' );
	}

	/* ------------------------------------------------------------------
	 * Content types
	 * ---------------------------------------------------------------- */
	public static function register_types() {
		$common = array(
			'public'       => true,
			'show_in_rest' => true,
			'has_archive'  => false,
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'revisions', 'custom-fields' ), // custom-fields: required for meta to appear in the REST response
		);

		register_post_type( 'hs_service', $common + array(
			'labels'    => self::labels( 'Service', 'Services' ),
			'rest_base' => 'services',
			'rewrite'   => array( 'slug' => 'services' ),
			'menu_icon' => 'dashicons-hammer',
		) );
		register_post_type( 'hs_industry', $common + array(
			'labels'    => self::labels( 'Industry', 'Industries' ),
			'rest_base' => 'industries',
			'rewrite'   => array( 'slug' => 'industries' ),
			'menu_icon' => 'dashicons-building',
		) );
		register_post_type( 'hs_case_study', $common + array(
			'labels'    => self::labels( 'Case Study', 'Case Studies' ),
			'rest_base' => 'case-studies',
			'rewrite'   => array( 'slug' => 'work' ),
			'menu_icon' => 'dashicons-awards',
		) );
	}

	private static function labels( $one, $many ) {
		return array(
			'name'          => $many,
			'singular_name' => $one,
			'add_new_item'  => "Add New $one",
			'edit_item'     => "Edit $one",
			'new_item'      => "New $one",
			'view_item'     => "View $one",
			'search_items'  => "Search $many",
			'not_found'     => "No $many found",
			'all_items'     => "All $many",
			'menu_name'     => $many,
		);
	}

	/* ------------------------------------------------------------------
	 * Fields. Types: text | textarea | lines | select | checkbox
	 * "lines" = one item per line. FAQs = "Question || Answer" per line.
	 * ---------------------------------------------------------------- */
	public static function fields() {
		$form_values = array( 'Website / Shopify', 'Mobile app', 'CRM & automation', 'AI integration', 'Meta Ads', 'Google Ads', 'LinkedIn Ads', 'ChatGPT / AI Ads', 'SEO', 'Social & content', 'Growth strategy / CRO' );
		return array(
			'hs_service'    => array(
				'hs_discipline'     => array( 'Discipline', 'select', array( 'dev-tech' => 'Dev & Tech', 'marketing' => 'Marketing', 'growth' => 'Business Growth' ) ),
				'hs_tagline'        => array( 'Tagline (hero sentence)', 'textarea' ),
				'hs_audit'          => array( 'Free offer, e.g. "free Meta Ads account audit"', 'text' ),
				'hs_form_value'     => array( 'Pre-select in enquiry form', 'select', array_combine( $form_values, $form_values ) ),
				'hs_for_who'        => array( 'Built for (one per line)', 'lines' ),
				'hs_signs'          => array( '"Sounds familiar?" problems (one per line, 4 works best)', 'lines' ),
				'hs_deliverables'   => array( 'What\'s included (one per line)', 'lines' ),
				'hs_moment'         => array( 'Scroll animation', 'select', array( 'ads' => 'Ad wall', 'serp' => 'Search results', 'seo' => 'SEO ranking climb', 'chat' => 'AI chat answer', 'targeting' => 'Audience targeting', 'build' => 'Page build', 'phone' => 'Phone app', 'flow' => 'Workflow diagram', 'dashboard' => 'Dashboard', 'ab' => 'A/B test' ) ),
				'hs_moment_label'   => array( 'Scroll animation headline', 'text' ),
				'hs_moment_query'   => array( 'Search query / AI prompt (Search, SEO, Chat animations)', 'text' ),
				'hs_moment_items'   => array( 'Workflow steps or targeting filters (one per line, up to 5)', 'lines' ),
				'hs_moment_variant' => array( 'Ad wall style', 'select', array( '' => 'Ads', 'feed' => 'Social feed' ) ),
				'hs_calc'           => array( 'Calculator', 'select', array( '' => 'None', 'roas' => 'Break-even ROAS', 'leads' => 'Leads & budget', 'cro' => 'Conversion uplift' ) ),
				'hs_pairs'          => array( '"Works better with" service slugs (comma separated, 2)', 'text' ),
				'hs_tools'          => array( 'Tool icons: simple-icons slugs (comma separated)', 'text' ),
				'hs_faqs'           => array( 'FAQs: one per line as  Question || Answer', 'textarea' ),
			),
			'hs_industry'   => array(
				'hs_letter'   => array( 'Index letter (A, B, C...)', 'text' ),
				'hs_tagline'  => array( 'Tagline', 'textarea' ),
				'hs_pains'    => array( 'Problems this industry faces (one per line)', 'lines' ),
				'hs_services' => array( 'Recommended service slugs (comma separated)', 'text' ),
				'hs_faqs'     => array( 'FAQs: one per line as  Question || Answer', 'textarea' ),
			),
			'hs_case_study' => array(
				'hs_approved'     => array( 'Client has approved these results and quote for publication', 'checkbox' ),
				'hs_client'       => array( 'Client name', 'text' ),
				'hs_industry'     => array( 'Industry slug (e.g. ecommerce-d2c)', 'text' ),
				'hs_services'     => array( 'Service slugs used (comma separated)', 'text' ),
				'hs_challenge'    => array( 'The challenge', 'textarea' ),
				'hs_approach'     => array( 'What we did', 'textarea' ),
				'hs_results'      => array( 'Verified results: one per line as  Value || Label  (e.g. 3.2x || ROAS in 90 days)', 'lines' ),
				'hs_quote'        => array( 'Client quote (approved)', 'textarea' ),
				'hs_quote_author' => array( 'Quote author, role', 'text' ),
			),
		);
	}

	public static function register_meta() {
		foreach ( self::fields() as $type => $fields ) {
			foreach ( $fields as $key => $f ) {
				register_post_meta( $type, $key, array(
					'type'              => 'checkbox' === $f[1] ? 'boolean' : 'string',
					'single'            => true,
					'show_in_rest'      => true,
					'default'           => 'checkbox' === $f[1] ? false : '',
					'sanitize_callback' => function ( $value ) use ( $f ) {
						return self::sanitize( $value, $f );
					},
					'auth_callback'     => function () {
						return current_user_can( 'edit_posts' );
					},
				) );
			}
		}
	}

	private static function sanitize( $value, $f ) {
		switch ( $f[1] ) {
			case 'checkbox':
				return (bool) $value;
			case 'select':
				return array_key_exists( (string) $value, $f[2] ) ? (string) $value : '';
			case 'textarea':
			case 'lines':
				return sanitize_textarea_field( (string) $value );
			default:
				return sanitize_text_field( (string) $value );
		}
	}

	public static function meta_boxes() {
		foreach ( self::fields() as $type => $fields ) {
			add_meta_box( 'hs_fields', 'HashSlash page content', array( __CLASS__, 'render_box' ), $type, 'normal', 'high' );
		}
	}

	public static function render_box( $post ) {
		$fields = self::fields()[ $post->post_type ];
		wp_nonce_field( self::NONCE, self::NONCE );
		echo '<p style="color:#646970">The page layout and animations come from the site design. Fill in the content here; the site rebuilds automatically about a minute after you publish.</p>';
		echo '<table class="form-table" role="presentation"><tbody>';
		foreach ( $fields as $key => $f ) {
			$val = get_post_meta( $post->ID, $key, true );
			echo '<tr><th scope="row"><label for="' . esc_attr( $key ) . '">' . esc_html( $f[0] ) . '</label></th><td>';
			switch ( $f[1] ) {
				case 'checkbox':
					echo '<input type="checkbox" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="1" ' . checked( (bool) $val, true, false ) . ' />';
					break;
				case 'select':
					echo '<select id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">';
					foreach ( $f[2] as $opt => $label ) {
						echo '<option value="' . esc_attr( $opt ) . '" ' . selected( $val, $opt, false ) . '>' . esc_html( $label ) . '</option>';
					}
					echo '</select>';
					break;
				case 'textarea':
				case 'lines':
					echo '<textarea class="large-text" rows="' . ( 'lines' === $f[1] ? 5 : 4 ) . '" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">' . esc_textarea( $val ) . '</textarea>';
					break;
				default:
					echo '<input class="large-text" type="text" id="' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( $val ) . '" />';
			}
			echo '</td></tr>';
		}
		echo '</tbody></table>';
	}

	public static function save_meta( $post_id, $post ) {
		if ( ! in_array( $post->post_type, self::TYPES, true ) ) {
			return;
		}
		if ( ! isset( $_POST[ self::NONCE ] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST[ self::NONCE ] ) ), self::NONCE ) ) {
			return;
		}
		if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}
		foreach ( self::fields()[ $post->post_type ] as $key => $f ) {
			$raw = isset( $_POST[ $key ] ) ? wp_unslash( $_POST[ $key ] ) : ( 'checkbox' === $f[1] ? '' : null ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
			if ( null === $raw ) {
				continue;
			}
			update_post_meta( $post_id, $key, self::sanitize( $raw, $f ) );
		}
	}

	/* ------------------------------------------------------------------
	 * Rebuild webhook (debounced: one build ~60s after the last change)
	 * ---------------------------------------------------------------- */
	public static function queue_rebuild( $new, $old, $post ) {
		$watched = array_merge( self::TYPES, array( 'page', 'post' ) );
		if ( ! in_array( $post->post_type, $watched, true ) ) {
			return;
		}
		if ( 'publish' !== $new && 'publish' !== $old ) {
			return; // draft-to-draft edits don't affect the live site
		}
		self::schedule();
	}

	public static function queue_rebuild_on_delete( $post_id ) {
		$post = get_post( $post_id );
		if ( $post && 'publish' === $post->post_status ) {
			self::schedule();
		}
	}

	private static function schedule() {
		if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
			wp_schedule_single_event( time() + 60, self::CRON_HOOK );
		}
	}

	public static function do_rebuild() {
		$hook = self::opt( 'deploy_hook' );
		if ( ! $hook ) {
			return false;
		}
		$res = wp_remote_post( $hook, array( 'timeout' => 10 ) );
		$ok  = ! is_wp_error( $res ) && wp_remote_retrieve_response_code( $res ) < 300;
		update_option( 'hs_headless_last_build', array( 'time' => time(), 'ok' => $ok ), false );
		return $ok;
	}

	public static function manual_rebuild() {
		check_admin_referer( 'hs_rebuild' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Not allowed' );
		}
		$ok = self::do_rebuild();
		wp_safe_redirect( add_query_arg( 'hs_msg', $ok ? 'rebuilt' : 'rebuild_failed', admin_url( 'options-general.php?page=hs-headless' ) ) );
		exit;
	}

	/* ------------------------------------------------------------------
	 * Settings
	 * ---------------------------------------------------------------- */
	private static function opt( $key ) {
		$o = get_option( self::OPT, array() );
		return isset( $o[ $key ] ) ? $o[ $key ] : '';
	}

	public static function register_settings() {
		register_setting( 'hs_headless', self::OPT, array(
			'type'              => 'array',
			'sanitize_callback' => function ( $in ) {
				return array(
					'frontend_url' => esc_url_raw( isset( $in['frontend_url'] ) ? untrailingslashit( $in['frontend_url'] ) : '' ),
					'deploy_hook'  => esc_url_raw( isset( $in['deploy_hook'] ) ? $in['deploy_hook'] : '' ),
					'redirect'     => ! empty( $in['redirect'] ),
				);
			},
		) );
	}

	public static function settings_page() {
		add_options_page( 'HashSlash Headless', 'HashSlash Headless', 'manage_options', 'hs-headless', array( __CLASS__, 'render_settings' ) );
	}

	public static function render_settings() {
		$last = get_option( 'hs_headless_last_build' );
		?>
		<div class="wrap">
			<h1>HashSlash Headless</h1>
			<form method="post" action="options.php">
				<?php settings_fields( 'hs_headless' ); ?>
				<table class="form-table" role="presentation">
					<tr><th scope="row"><label for="hs_front">Front-end URL</label></th>
						<td><input class="regular-text" id="hs_front" name="<?php echo esc_attr( self::OPT ); ?>[frontend_url]" value="<?php echo esc_attr( self::opt( 'frontend_url' ) ); ?>" placeholder="https://www.hashslash.example" /></td></tr>
					<tr><th scope="row"><label for="hs_hook">Deploy hook URL</label></th>
						<td><input class="large-text" id="hs_hook" name="<?php echo esc_attr( self::OPT ); ?>[deploy_hook]" value="<?php echo esc_attr( self::opt( 'deploy_hook' ) ); ?>" placeholder="https://api.netlify.com/build_hooks/..." />
						<p class="description">From your host (Netlify, Vercel or Cloudflare Pages). Called about a minute after content is published, updated or unpublished.</p></td></tr>
					<tr><th scope="row">Redirect old theme</th>
						<td><label><input type="checkbox" name="<?php echo esc_attr( self::OPT ); ?>[redirect]" value="1" <?php checked( (bool) self::opt( 'redirect' ) ); ?> /> Send front-end visitors of this WordPress site to the front-end URL (wp-admin and the API keep working)</label></td></tr>
				</table>
				<?php submit_button(); ?>
			</form>

			<hr />
			<h2>Rebuild the live site</h2>
			<p>Last build trigger: <?php echo $last ? esc_html( wp_date( 'j M Y, H:i', $last['time'] ) . ( $last['ok'] ? ' (sent)' : ' (failed)' ) ) : 'never'; ?></p>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="hs_rebuild" />
				<?php wp_nonce_field( 'hs_rebuild' ); ?>
				<?php submit_button( 'Rebuild now', 'secondary', 'submit', false ); ?>
			</form>

			<hr />
			<h2>Import starter content</h2>
			<p>Creates the 24 services and 4 industries that the site currently ships with. Items whose slug already exists are skipped, so it is safe to run twice.</p>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="hs_import" />
				<?php wp_nonce_field( 'hs_import' ); ?>
				<label><input type="checkbox" name="as_draft" value="1" /> Import as drafts (review before they go live)</label>
				<?php submit_button( 'Import starter content', 'secondary' ); ?>
			</form>
		</div>
		<?php
	}

	public static function notices() {
		if ( empty( $_GET['hs_msg'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return;
		}
		$msg = sanitize_key( $_GET['hs_msg'] ); // phpcs:ignore WordPress.Security.NonceVerification
		$map = array(
			'rebuilt'        => array( 'success', 'Rebuild triggered. The live site updates in a few minutes.' ),
			'rebuild_failed' => array( 'error', 'Rebuild failed. Check the deploy hook URL.' ),
			'imported'       => array( 'success', 'Starter content imported.' ),
		);
		if ( isset( $map[ $msg ] ) ) {
			printf( '<div class="notice notice-%s is-dismissible"><p>%s</p></div>', esc_attr( $map[ $msg ][0] ), esc_html( $map[ $msg ][1] ) );
		}
	}

	/* ------------------------------------------------------------------
	 * Starter content import (bundled JSON, no credentials needed)
	 * ---------------------------------------------------------------- */
	public static function import_seed() {
		check_admin_referer( 'hs_import' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Not allowed' );
		}
		$status = empty( $_POST['as_draft'] ) ? 'publish' : 'draft';
		foreach ( array( 'hs_service' => 'services.json', 'hs_industry' => 'industries.json' ) as $type => $file ) {
			$path = plugin_dir_path( __FILE__ ) . 'seed/' . $file;
			if ( ! is_readable( $path ) ) {
				continue;
			}
			$items = json_decode( file_get_contents( $path ), true ); // phpcs:ignore WordPress.WP.AlternativeFunctions
			if ( ! is_array( $items ) ) {
				continue;
			}
			$allowed = self::fields()[ $type ];
			foreach ( $items as $i => $item ) {
				if ( get_page_by_path( $item['slug'], OBJECT, $type ) ) {
					continue;
				}
				$meta = array();
				foreach ( $item['meta'] as $k => $v ) {
					if ( isset( $allowed[ $k ] ) ) {
						$meta[ $k ] = self::sanitize( $v, $allowed[ $k ] );
					}
				}
				wp_insert_post( array(
					'post_type'    => $type,
					'post_status'  => $status,
					'post_title'   => sanitize_text_field( $item['title'] ),
					'post_name'    => sanitize_title( $item['slug'] ),
					'post_excerpt' => sanitize_textarea_field( isset( $item['excerpt'] ) ? $item['excerpt'] : '' ),
					'menu_order'   => (int) $i,
					'meta_input'   => $meta,
				) );
			}
		}
		self::schedule();
		wp_safe_redirect( add_query_arg( 'hs_msg', 'imported', admin_url( 'options-general.php?page=hs-headless' ) ) );
		exit;
	}

	/* ------------------------------------------------------------------
	 * Headless redirect + hardening
	 * ---------------------------------------------------------------- */
	public static function redirect_frontend() {
		$front = self::opt( 'frontend_url' );
		if ( ! self::opt( 'redirect' ) || ! $front || is_admin() || is_preview() || wp_doing_ajax() || wp_doing_cron() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
			return;
		}
		$path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ), PHP_URL_PATH ) : '/';
		wp_redirect( $front . ( $path ? $path : '/' ), 301 ); // phpcs:ignore WordPress.Security.SafeRedirect -- destination is an admin-configured URL
		exit;
	}

	/** Never expose results or quotes publicly until the client has approved them. */
	public static function guard_unapproved( $response, $post ) {
		if ( current_user_can( 'edit_posts' ) || get_post_meta( $post->ID, 'hs_approved', true ) ) {
			return $response;
		}
		$data = $response->get_data();
		foreach ( array( 'hs_results', 'hs_quote', 'hs_quote_author' ) as $k ) {
			if ( isset( $data['meta'][ $k ] ) ) {
				$data['meta'][ $k ] = '';
			}
		}
		$response->set_data( $data );
		return $response;
	}

	public static function hide_user_endpoints( $endpoints ) {
		if ( ! is_user_logged_in() ) {
			unset( $endpoints['/wp/v2/users'], $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
		}
		return $endpoints;
	}
}

HS_Headless::init();

register_deactivation_hook( __FILE__, function () {
	wp_clear_scheduled_hook( HS_Headless::CRON_HOOK );
} );
