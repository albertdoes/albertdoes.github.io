<script lang="ts">
    export let darkmode = false;

    $: display_color = (darkmode ? "#ffffff" : "#273043");
</script>

<div id="under_construction" style="color: {display_color}">
    <h1 id="main_header">
        This site was asking attention from the author.
    </h1>
    <hr/>
    <p id="description">
        This humble site is currently unplugged from the web. (Well, technically, no. But anyways) <br/>
        It will be alive by the start of this <span id="release_month">September</span> after brewing with serious dectication and stressful errors.
    </p>
</div>

<style lang="sass">
    @use '../../styles/effects'
    @use '../../styles/colors'

    #under_construction
        max-width: 35rem
        padding: 2rem 1rem

    hr
        border-image: linear-gradient(60deg, colors.$secondary, colors.$primary 60%) 30%
        border-width: 0 0 0.25rem

    #main_header, #release_month
        font-weight: 900
        @include effects.text-gradient($color1: colors.$primary, $color2: colors.$secondary)

    #main_header
        text-align: left
        text-decoration: underline
        text-decoration-color: colors.$selective-yellow
</style>