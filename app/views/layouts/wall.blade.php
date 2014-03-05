<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Larawall</title>

        <link rel="stylesheet" href="{{ asset('css/bootstrap.3.1.1.min.css') }}"/>
        <link rel="stylesheet" href="{{ asset('css/bootstrap-theme.3.1.1.min.css') }}"/>
        <link rel="stylesheet" href="{{ asset('css/font-awesome.4.0.3.min.css') }}"/>
        <link rel="stylesheet" href="{{ asset('css/global.css') }}"/>

    </head>
    <body>

        <div class="row fullscreen">
            <div class="col-xs-6 left">

                @include('partials.sessions')
                @include('partials.sponsors')

            </div>
            <div class="col-xs-6 right">
                @include('partials.tweets')
            </div>
        </div>

        <script type="text/javascript" src="{{ asset('js/jquery.2.1.0.min.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/bootstrap.3.1.1.min.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/larawall.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/core.js') }}"></script>
    </body>
</html>