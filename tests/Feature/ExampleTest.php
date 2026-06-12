<?php

test('home redirige vers le frontend', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect();
});