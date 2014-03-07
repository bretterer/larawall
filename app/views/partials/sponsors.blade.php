<div class="sponsors">
    <p>Sponsors:</p>
    @foreach(Config::get('sponsors') as $sponsor)
        @include('partials.sponsor')
    @endforeach
</div>